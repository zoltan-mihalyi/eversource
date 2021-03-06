import * as PIXI from 'pixi.js';
import * as React from 'react';
import { EventBus } from '../../../common/es/EventBus';
import { ClientEvents } from '../../src/es/ClientEvents';
import { app, appContainer } from '../SampleData';

interface Props {
    display: PIXI.DisplayObject;
    eventBus: EventBus<ClientEvents>;
    backgroundColor?: number;
}

PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

export class TestScreen extends React.PureComponent<Props> {
    private containerRef = React.createRef<HTMLDivElement>();

    render() {
        return (
            <div ref={this.containerRef}/>
        );
    }

    componentDidMount() {
        app.renderer.backgroundColor = this.props.backgroundColor || 0xffcc88;
        this.containerRef.current!.appendChild(app.view);
        appContainer.addChild(this.props.display);

        app.ticker.add(this.tick);
    }

    componentWillUnmount() {
        appContainer.removeChildren();

        app.ticker.remove(this.tick)
    }

    private tick = () => {
        this.props.eventBus.emit('render', void 0);
    }
}

