let touched = false;
const callbacks = new Set<() => void>();

window.addEventListener('touchstart', function onFirstTouch() {
    touched = true;

    callbacks.forEach(callback => callback());

    window.removeEventListener('touchstart', onFirstTouch, false);
});

export interface Wait {
    stop(): void;
}

export function waitUntilTouch(callback: () => void): Wait {
    if (touched) {
        callback();
    } else {
        callbacks.add(callback);
    }

    return {
        stop: () => callbacks.delete(callback),
    }
}

