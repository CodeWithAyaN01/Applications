import { createWorker, PSM, OEM } from "tesseract.js";

let worker = null; // Global Worker
let initPromise = null; // guards against double-init races

// Noise filters applied AFTER recognition, not during it. We deliberately
// do NOT use tessedit_char_whitelist: a whitelist doesn't just filter
// output, it forces the recognizer to substitute the nearest ALLOWED
// character for anything outside the set — which silently corrupts real
// content (emails, file paths, prices, code punctuation) instead of just
// failing to read it. Filtering bad words out afterward is safer than
// constraining what the engine is allowed to see in the first place.
const NO_ALNUM = /^[^A-Za-z0-9]+$/;      // pure punctuation/symbol garbage, any charset
const REPEATED_LETTER = /^([A-Za-z])\1+$/; // "iiii", "llll", "OOOO" — icon/border misreads.
// NOTE: deliberately does NOT match repeated digits — "11", "22", "44",
// "1111" etc. are completely legitimate (line numbers, ports, values) and
// an earlier version of this filter was wrongly dropping them.

const MIN_CONFIDENCE = 50;  // low-contrast/small UI text reads at lower confidence
                             // than body text; NO_ALNUM/REPEATED_LETTER below catch
                             // the actual junk, so this doesn't have to do that job.
const MIN_BOX_SIZE = 2;     // px; only drops near-zero-size boxes (true artifacts)

export async function initializeOCR() {

    if (worker) {
        return; // already initialized, don't spin up a second worker
    }

    if (initPromise) {
        return initPromise; // init already in-flight
    }

    initPromise = (async () => {

        console.log("Initializing OCR...");

        // OEM.LSTM_ONLY: skip the legacy Tesseract engine entirely. This
        // is tesseract.js's own default already, but pinning it explicitly
        // protects against that default changing upstream. It's both the
        // fastest and most accurate mode for modern trained data — no
        // trade-off here.
        worker = await createWorker("eng", OEM.LSTM_ONLY);

        // PSM.AUTO: full-page layout analysis — finds text blocks, lines,
        // and columns and uses that structure to read connected text
        // correctly. Real screenshots (code panes, sidebars, menu bars,
        // dialogs) are structured, not scattered, so AUTO reads them far
        // more accurately than PSM.SPARSE_TEXT does (SPARSE_TEXT treats
        // every word as isolated and fragments badly on this kind of
        // content — confirmed by testing).
        //
        // Dictionary correction (dawg) is left ON (Tesseract's default).
        // It's a safety net: it fixes small, noisy reads of real words
        // back into correct ones instead of letting them fail validation
        // and get dropped entirely.
        await worker.setParameters({
            tessedit_pageseg_mode: PSM.AUTO,
            preserve_interword_spaces: "1",
            // Our PNG buffer has no DPI metadata, so Tesseract runs a
            // "guess the resolution from stroke width" pass on every
            // call. Since the image is already enlarged before it
            // reaches us, telling it the DPI directly skips that pass —
            // a free speed win with no accuracy cost.
            user_defined_dpi: "300",
        });

        console.log("OCR Ready");

    })();

    return initPromise;
}

export async function extractText(imageBuffer) {

    if (!worker) {
        // Defensive fallback — keeps old call sites working even if
        // initializeOCR() was skipped or hasn't resolved yet.
        await initializeOCR();
    }

    console.log("OCR working");
    const started = Date.now();

    const result = await worker.recognize(
        imageBuffer,
        {},
        {
            tsv: true,
        }
    );

    console.log(`OCR Completed in ${Date.now() - started}ms`);

    return parseTSV(result.data.tsv);
}

function parseTSV(tsv) {

    const rows = tsv.split("\n");

    const words = [];
    // Letters, digits, and the punctuation that shows up constantly in
    // real interfaces: paths (. / \ -), emails/URLs (@ :), prices (%),
    // code (_). Broad enough to not corrupt legitimate content, narrow
    // enough that pure icon/glyph noise still gets caught by the filters
    // below.
    const validWord = /^[A-Za-z0-9@._\-:/\\%]+$/;

    for (const row of rows) {

        const columns = row.split("\t");

        const text = columns[11];
        const confidence = Number(columns[10]);
        const width = Number(columns[8]);
        const height = Number(columns[9]);

        if (columns[0] !== "5") continue;              // word-level rows only
        if (!text) continue;
        if (confidence < MIN_CONFIDENCE) continue;
        if (text.length < 2) continue;
        if (!validWord.test(text)) continue;
        if (NO_ALNUM.test(text)) continue;              // "--", "..", "()", etc.
        if (REPEATED_LETTER.test(text)) continue;       // "iiii", "OOOO" (not digits)
        if (width < MIN_BOX_SIZE || height < MIN_BOX_SIZE) continue; // stray artifacts

        words.push({
            text,
            x: Number(columns[6]),
            y: Number(columns[7]),
            width,
            height,
            confidence,
            line: Number(columns[4])
        });
    }
    return words;
}