import * as React from 'react';
import { EditPresetProps } from '../ShowPreset';
import { MonsterPreset } from '../../../../server/src/world/Presets';
import { PropTable } from '../PropTable';
import * as path from "path";
import { wwwDir } from '../../Utils';
import * as fs from "fs";
import { getVariations } from '../utils';
import { objectEdit } from '../../components/edit/ObjectEdit';
import { optionalEdit } from '../../components/edit/OptionalEdit';
import { CreatureSoundDescriptor } from '../../../../server/src/es/ServerComponents';
import { TextEdit } from '../../components/edit/TextEdit';
import { NumberEdit } from '../../components/edit/NumberEdit';

const base = path.join(wwwDir, 'spritesheets', 'monster');

const EMPTY_SOUND_DESCRIPTOR: CreatureSoundDescriptor = {
    directory: 'goblin',
    aggro: 0,
    attack: 0,
    idle: 0,
    die: 0
};

const MonsterPresetPropsEditor = objectEdit<MonsterPreset, 'image' | 'palette' | 'movement' | 'level' | 'attitude' | 'name' | 'story' | 'scale' | 'effects'>({
    sound: {
        component: optionalEdit<CreatureSoundDescriptor, undefined>(EMPTY_SOUND_DESCRIPTOR, objectEdit<CreatureSoundDescriptor>({
            directory: { component: TextEdit },
            aggro: { component: NumberEdit },
            attack: { component: NumberEdit },
            die: { component: NumberEdit },
            idle: { component: NumberEdit },
        }), void 0)
    }
});

const possibleValues: { [P in keyof All]: string[] } = {
    appearance: fs.readdirSync(base),
};

interface All {
    appearance: [string, string] | [string];
}

export class MonsterEdit extends React.PureComponent<EditPresetProps<MonsterPreset>> {
    render() {
        const { preset } = this.props;

        const appearance: All['appearance'] = [preset.image];
        if (preset.palette) {
            appearance.push(preset.palette);
        }
        const all: All = {
            appearance,
        };

        return (
            <>
                <PropTable data={all} values={possibleValues} forceSelect={['appearance']} readExtraValues={readExtraValues}
                           onChange={this.onChangeAppearance}/>
                <MonsterPresetPropsEditor value={preset} onChange={this.props.onChange}/>
            </>
        );
    }

    private onChangeAppearance = (data: All) => {
        this.props.onChange({
            image: data.appearance[0],
            palette: data.appearance[1] || null
        });
    };
}

function readExtraValues(key: string, value: string) {
    return getVariations(`${base}/${value}/palettes.json`)
}
