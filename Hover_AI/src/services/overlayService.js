let overlayWindow = null;

export function setOverlayWindow(window) {

    overlayWindow = window;

}

export function hideOverlay() {

    if (!overlayWindow) return;

    overlayWindow.hide();

}

export function showOverlay() {

    if (!overlayWindow) return;

    overlayWindow.show();

}