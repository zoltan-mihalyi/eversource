import * as React from 'react';
import { brown } from '../theme';

interface State {
    fps: number;
}

const STYLE: React.CSSProperties = {
    padding: 5,
    color: brown.lightest,
    textAlign: 'right',
};

export class DebugInfo extends React.PureComponent<{}, State> {
    private timer: any = null;
    private times: number[] = [];
    state: State = {
        fps: 0,
    };

    render() {
        return (
            <div className="gui top right" style={STYLE}>
                FPS: {this.state.fps}<br/>
                Version: {process.env.CLIENT_VERSION}
            </div>
        );
    }

    componentDidMount() {
        this.timer = requestAnimationFrame(this.updateTimer);
    }

    componentWillUnmount() {
        cancelAnimationFrame(this.timer);
    }

    private updateTimer = () => {
        const now = performance.now();
        while (this.times.length > 0 && this.times[0] <= now - 1000) {
            this.times.shift();
        }
        this.times.push(now);
        this.setState({ fps: this.times.length });

        this.timer = requestAnimationFrame(this.updateTimer);
    };
}