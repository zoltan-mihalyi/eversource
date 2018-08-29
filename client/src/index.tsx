import * as React from "react";
import * as ReactDOM from "react-dom";

import { HealthBar } from './components/HealthBar';
import { log } from '../../common/Common';

ReactDOM.render(
    <HealthBar/>,
    document.getElementById('game-gui'),
);

log('hello');