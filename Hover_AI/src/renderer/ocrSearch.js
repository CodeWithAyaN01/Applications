function normalize(text) {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "");
}

// A single OCR pass is often searched several times in a row (guidance
// flow, retries, multiple phrases from one Gemini response). Caching the
// normalized form directly on each word object means repeated searches
// against the same words array only pay the normalize() cost once per word.
function getNormalized(word) {
    if (word._norm === undefined) {
        word._norm = normalize(word.text);
    }
    return word._norm;
}

export function findWord(words, target) {

    if (!target) return null;

    const search = normalize(target);

    return words.find(word =>
        getNormalized(word) === search
    ) ?? null;
}

export function findAllWords(words, target) {

    if (!target) return [];

    const search = normalize(target);

    if (!search) return [];

    return words.filter(word => {

        const text = getNormalized(word);

        return (
            text === search ||
            text.includes(search)
        );

    });

}

export function findPhrase(words, phrase) {

    const parts = phrase.trim().split(/\s+/);

    if (parts.length !== 2) {
        return null;
    }

    const [firstWord, secondWord] = parts;

    const firstMatches = findAllWords(words, firstWord);
    const secondMatches = findAllWords(words, secondWord);

    if (firstMatches.length === 0 || secondMatches.length === 0) {
        return null;
    }

    let bestPair = null;
    let bestDistance = Infinity;

    for (const first of firstMatches) {

        for (const second of secondMatches) {

            // Handles merged OCR words like "RecycleBin",
            // "TaskManager", "VisualStudio", etc.
            if (first === second) {

                return {
                    text: phrase,
                    x: first.x,
                    y: first.y,
                    width: first.width,
                    height: first.height,
                    words: [first]
                };

            }

            const dx = second.x - first.x;
            const dy = Math.abs(second.y - first.y);

            // Wrong reading order
            if (dx <= 0) {
                continue;
            }

            // Too far apart
            if (dx > 150 || dy > 30) {
                continue;
            }

            const distance = dx + dy;

            if (distance < bestDistance) {

                bestDistance = distance;

                bestPair = {
                    first,
                    second
                };

            }

        }

    }

    if (!bestPair) {
        return null;
    }

    const { first, second } = bestPair;

    const left = Math.min(first.x, second.x);
    const top = Math.min(first.y, second.y);

    const right = Math.max(
        first.x + first.width,
        second.x + second.width
    );

    const bottom = Math.max(
        first.y + first.height,
        second.y + second.height
    );

    return {

        text: phrase,

        x: left,

        y: top,

        width: right - left,

        height: bottom - top,

        words: [
            first,
            second
        ]

    };

}