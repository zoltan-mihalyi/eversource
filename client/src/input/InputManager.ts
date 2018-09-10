// x and y between -1 and 1
import { KeyboardInput, KEYS } from './KeyboardInput';
import { VirtualJoystick } from './VirtualJoystick';

export interface MovementIntent {
    x: number;
    y: number;
}

export class InputManager {
    private keyboardInput = new KeyboardInput();
    private virtualJoystick = new VirtualJoystick();

    getMovementIntent(): MovementIntent {
        let { x, y } = this.virtualJoystick.getMovementIntent();
        if (this.keyboardInput.isDown(KEYS.W)) {
            y = -1;
        } else if (this.keyboardInput.isDown(KEYS.S)) {
            y = 1;
        }
        if (this.keyboardInput.isDown(KEYS.A)) {
            x = -1;
        } else if (this.keyboardInput.isDown(KEYS.D)) {
            x = 1;
        }

        return { x, y };
    }

    destroy() {
        this.keyboardInput.destroy();
        this.virtualJoystick.destroy();
    }

    clearPressedKeys() {
        this.keyboardInput.clearPressedKeys();
    }

    initializeJoystick(container:HTMLElement){
        this.virtualJoystick.initialize(container);
    }
}
