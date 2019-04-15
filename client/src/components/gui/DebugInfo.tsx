import * as React from 'react';
import { brown } from '../theme';
import { Positioned } from '../common/Positioned';
import { StyleRules, WithStyles } from '../interfaces';
import { injectSheet } from '../utils';

type ClassKeys = 'root';

const styles: StyleRules<ClassKeys> = {
    root: {
        padding: 5,
        color: brown.lightest,
        textAlign: 'right',

    }
};

interface State {
    fps: number;
}

class RawDebugInfo extends React.PureComponent<WithStyles<ClassKeys>, State> {
    private timer: any = null;
    private times: number[] = [];

    state: State = {
        fps: 0,
    };

    render() {
        return (
            <Positioned horizontal="right" vertical="top">
                <div className={this.props.classes.root}>
                    FPS: {this.state.fps}<br/>
                    Version: {process.env.CLIENT_VERSION}
                </div>
            </Positioned>
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

export const DebugInfo = injectSheet(styles)(RawDebugInfo);
