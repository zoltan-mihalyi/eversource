import { StyleRules, WithStyles } from '../interfaces';
import * as React from 'react';
import { className, injectSheet, SMALL_DEVICE } from '../utils';
import { brown } from '../theme';


type ClassKeys = 'root' | 'fixedHeight' | 'paper' | 'padding';

const styles: StyleRules<ClassKeys> = {
    root: {
        maxHeight: 440,
        overflowY: 'auto',
        flexGrow: 1,
        width: 360,
        [SMALL_DEVICE]: {
            maxHeight: 220,
            width: 180,
        },
    },
    fixedHeight: {
        height: 440,
        flexShrink: 0,
        [SMALL_DEVICE]: {
            height: 220,
        },
    },
    paper: {
        backgroundImage: "url(css/game/paper.png)",
        color: brown.darkest,
    },
    padding: {
        padding: 12,
        [SMALL_DEVICE]: {
            padding: 6,
        },
    },
};

interface Props {
    variant?: 'paper';
    padding?: boolean;
    autoScroll?: boolean;
    fixedHeight?: boolean;
}

class RawScrollable extends React.PureComponent<Props & WithStyles<ClassKeys>> {
    private div = React.createRef<HTMLDivElement>();
    private atBottom = false;

    render() {
        const { children, variant, padding, fixedHeight, classes } = this.props;

        return (
            <div ref={this.div} onScroll={this.handleScroll}
                 className={className(classes.root, variant && classes[variant], fixedHeight && classes.fixedHeight)}>
                <div className={className(padding && classes.padding)}>
                    {children}
                </div>
            </div>
        );
    }

    componentDidUpdate(prevProps: Readonly<Props & WithStyles<ClassKeys>>, prevState: Readonly<{}>, snapshot?: any): void {
        if (this.props.autoScroll) {
            const div = this.div.current!;

            const atBottom = this.isScrolledToBottom();

            if (this.atBottom) {
                div.scrollTop = div.scrollHeight;
            }
            this.atBottom = atBottom || this.atBottom;
        }
    }

    private isScrolledToBottom() {
        const div = this.div.current!;

        return Math.floor(div.scrollTop) === div.scrollHeight - div.clientHeight;
    }

    private handleScroll = () => {
        this.atBottom = this.isScrolledToBottom();
    }
}

export const Scrollable = injectSheet(styles)(RawScrollable);
