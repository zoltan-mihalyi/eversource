import * as React from 'react';
import { EditPresetProps } from '../ShowPreset';
import { MonsterPreset } from '../../../../server/src/world/Presets';
import { PropTable } from '../PropTable';
import * as path from "path";
import { wwwDir } from '../../Utils';
import * as fs from "fs";
import { getVariations } from '../utils';
import { MonsterExtraPropsEdit } from '../../templates/MonsterTemplateEdit';

const base = path.join(wwwDir, 'spritesheets', 'monster');

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
                <MonsterExtraPropsEdit value={preset} onChange={this.props.onChange}/>
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
