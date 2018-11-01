import * as React from "react";
import * as ReactDOM from "react-dom";
import { App } from './App';

document.addEventListener('contextmenu', (e) => e.preventDefault());

ReactDOM.render(
    <App/>,
    document.getElementById('game-gui'),
);