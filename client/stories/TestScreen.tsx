import { UpdatableDisplay } from '../src/display/UpdatableDisplay';
import * as PIXI from 'pixi.js';
import * as React from 'react';

interface Props {
    display: UpdatableDisplay<any>;
    backgroundColor?: number;
}

PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

export const app = new PIXI.Application();
const container = new PIXI.Container();
container.x = 400;
container.y = 400;
container.scale.set(4);
app.stage.addChild(container);

export class TestScreen extends React.PureComponent<Props> {
    private containerRef = React.createRef<HTMLDivElement>();

    render() {
        return (
            <div ref={this.containerRef}/>
        );
    }

    componentDidMount() {
        app.renderer.backgroundColor = this.props.backgroundColor || 0;
        this.containerRef.current!.appendChild(app.view);
        container.addChild(this.props.display);
    }

    componentWillUnmount() {
        container.removeChildren();
    }
}

