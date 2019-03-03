export class KeyboardInput {
    private down = new Set<number>();
    private pressed = new Set<number>();

    constructor() {
        document.addEventListener('keydown', this.keyDown);
        document.addEventListener('keyup', this.keyUp);
    }

    isDown(key: number) {
        if (document.activeElement && document.activeElement !== document.body) {
            return false;
        }
        return this.down.has(key);
    }

    isPressed(key: number) {
        return this.pressed.has(key);
    }

    destroy() {
        document.removeEventListener('keydown', this.keyDown);
        document.removeEventListener('keyup', this.keyUp)
    }

    clearPressedKeys() {
        this.pressed.clear();
    }

    private keyDown = (e: KeyboardEvent) => {
        const keyCode = getKeyCode(e);
        if (this.down.has(keyCode)) {
            return;
        }

        this.pressed.add(keyCode);
        this.down.add(keyCode);
    };

    private keyUp = (e: KeyboardEvent) => {
        const keyCode = getKeyCode(e);
        this.down.delete(keyCode);
    };
}

function getKeyCode(event: KeyboardEvent): number {
    return event.which;
}

export const KEYS = {
    W: 87,
    A: 65,
    S: 83,
    D: 68,
};