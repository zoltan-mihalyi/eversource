import * as React from 'react';
import { black, brown } from '../theme';
import { injectSheet, SMALL_DEVICE } from '../utils';
import { StyleRules, WithStyles } from '../interfaces';
import { withOpacity } from '../../utils';

type ClassKeys = 'root';

const styles: StyleRules<ClassKeys> = {
    root: {
        backgroundColor: withOpacity(black, 0.8),
        color: brown.lightest,
        borderStyle: 'solid',
        borderWidth: 2,
        borderColor: brown.normal,
        padding: 8,
        borderRadius: 4,
        lineHeight: 1.5,
        fontSize: 18,
        maxWidth: 360,

        [SMALL_DEVICE]: {
            fontSize: 12,
            maxWidth: 180,
        },

        '& > h3': {
            fontSize: 20,
            whiteSpace: 'nowrap',
            fontWeight: 'normal',

            [SMALL_DEVICE]: {
                fontSize: 16
            }
        },

        '& > p, & > h3': {
            marginTop: 0,
            marginBottom: 0,
        }
    },
};

const RawTooltipBox:React.FunctionComponent<WithStyles<ClassKeys>> = ({classes,children})=>(
    <div className={classes.root}>
        {children}
    </div>
);

export default injectSheet(styles)(RawTooltipBox);
