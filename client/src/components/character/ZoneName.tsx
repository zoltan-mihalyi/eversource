import * as React from 'react';
import { injectSheet, SMALL_DEVICE } from '../utils';
import { StyleRules, WithStyles } from '../interfaces';
import { brown, red } from '../theme';

type ClassKeys = 'root';

const styles: StyleRules<ClassKeys> = {
    root: {
        fontSize: 24,
        fontWeight: 'normal',
        color: brown.normal,
        marginTop: 4,
        marginBottom: 20,

        [SMALL_DEVICE]: {
            fontSize: 12,
        },
    },
};

interface Props {
    zone: string;
}

const RawZoneName: React.FunctionComponent<Props & WithStyles<ClassKeys>> = ({ zone, classes }) => (
    <h3 className={classes.root}>{zone}</h3>
);

export const ZoneName = injectSheet(styles)(RawZoneName);
