///<reference path="../defs.d.ts"/>
import * as nipple from 'nipplejs'
import { EventData, Manager, NippleInteractiveData } from 'nipplejs'
import { MovementIntent } from './InputManager';
import { Wait, waitUntilTouch } from './WaitUntilTouch';

const NO_MOVEMENT = { x: 0, y: 0 };

export class VirtualJoystick {
    private waitUntilTouch: Wait | null = null;
    private joystick: Manager | null = null;
    private movementIntent: MovementIntent = NO_MOVEMENT;

    initialize(element: HTMLElement) {
        this.waitUntilTouch = waitUntilTouch(() => {
            this.joystick = nipple.create({
                zone: element,
                mode: 'static',
                position: { right: '90px', bottom: '90px' },
                color: 'white',
            });
            this.joystick.get(0).el.style.zIndex = '';
            this.joystick.on('move', this.onJoystickUpdate);
            this.joystick.on('end', this.onJoystickUpdate);
        });
    }

    getMovementIntent(): MovementIntent {
        return this.movementIntent;
    }

    destroy() {
        if (this.joystick) {
            this.joystick.destroy();
        }
        if (this.waitUntilTouch) {
            this.waitUntilTouch.stop();
        }
    }

    private onJoystickUpdate = (event: EventData, data: NippleInteractiveData) => {
        if (event.type === 'end') {
            this.movementIntent = NO_MOVEMENT;
            return;
        }

        const { radian } = data.angle;
        const force = Math.min(data.force, 1);

        this.movementIntent = {
            x: Math.cos(radian) * force,
            y: -Math.sin(radian) * force,
        };
    };
}
