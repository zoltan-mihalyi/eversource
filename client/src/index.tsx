import * as React from "react";
import * as ReactDOM from "react-dom";
import { App } from './App';
import * as PIXI from 'pixi.js';

PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
PIXI.settings.MIPMAP_TEXTURES = false;

document.addEventListener('touchstart', handleTouch);
document.addEventListener('touchend', handleTouch);
document.addEventListener('touchcancel', handleTouch);

let touching = false;

function handleTouch(e: TouchEvent) {
    touching = e.touches.length !== 0;
}

document.body.addEventListener('contextmenu', (e) => {
    if (!touching) { // Disable vibration on chrome for android
        e.preventDefault();
    }
});

ReactDOM.render(
    <App/>,
    document.getElementById('game-gui'),
);