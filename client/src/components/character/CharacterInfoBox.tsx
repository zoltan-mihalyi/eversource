import * as React from 'react';
import { CharacterInfo } from '../../../../common/domain/CharacterInfo';
import { injectSheet, SMALL_DEVICE } from '../utils';
import { StyleRules, WithStyles } from '../interfaces';
import { brown } from '../theme';
import { ZoneName } from './ZoneName';

type ClassKeys = 'root' | 'name' | 'details';

const styles: StyleRules<ClassKeys> = {
    root: {
        padding: 10,

        [SMALL_DEVICE]: {
            padding: 6,
        },
    },
    name: {

        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        overflow: 'hidden',

        fontSize: 32,
        color: brown.lightest,
        marginTop: 4,
        marginBottom: 10,

        [SMALL_DEVICE]: {
            fontSize: 16,
        },
    },
    details: {
        fontSize: 24,
        fontWeight: 'normal',
        color: brown.lighter,
        marginTop: 4,
        marginBottom: 10,
        [SMALL_DEVICE]: {
            fontSize: 12,
        },
    },
};

interface Props {
    character: CharacterInfo;
}

const RawCharacterInfoBox: React.FunctionComponent<Props & WithStyles<ClassKeys>> = ({ character, classes }) => (
    <div className={classes.root}>
        <h2 className={classes.name}>{character.name}</h2>
        <h3 className={classes.details}>Level {character.level} {character.classId}</h3>
        <ZoneName zone={character.location.zoneId}/>
    </div>
);

export const CharacterInfoBox = injectSheet(styles)(RawCharacterInfoBox);
