import * as React from 'react';
import { EditPresetProps } from '../ShowPreset';
import { ObjectPreset } from '../../../../server/src/world/Presets';
import { PropTable } from '../PropTable';
import * as fs from "fs";
import * as path from "path";
import { wwwDir } from '../../Utils';
import { TileSet } from '../../../../common/tiled/interfaces';
import { optionalEdit } from '../../components/edit/OptionalEdit';
import { TextEdit } from '../../components/edit/TextEdit';
import { objectEdit } from '../../components/edit/ObjectEdit';

const base = path.join(wwwDir, 'spritesheets', 'object');

interface All {
    appearance: [string, string];
}

const suffix = '.png';
const possibleValues: { [P in keyof All]: string[] } = {
    appearance: fs.readdirSync(base)
        .filter(file => file.endsWith(suffix))
        .map(file => file.substring(0, file.length - suffix.length)),
};

const ObjectPresetPropsEditor = objectEdit<ObjectPreset, 'image' | 'animation' | 'name' | 'story' | 'scale' | 'effects'>({
    useSpell: { component: optionalEdit<string, undefined>('', TextEdit, void 0) }
});

export class ObjectEdit extends React.PureComponent<EditPresetProps<ObjectPreset>> {
    render() {
        const { preset } = this.props;
        const all: All = {
            appearance: [preset.image, preset.animation]
        };

        return (
            <>
                <PropTable data={all} values={possibleValues} forceSelect={['appearance']} forceSelect2={['appearance']}
                           readExtraValues={readExtraValues} onChange={this.onChangeAppearance}/>
                <ObjectPresetPropsEditor value={preset} onChange={this.props.onChange}/>
            </>
        );
    }

    private onChangeAppearance = (data: All) => {
        this.props.onChange({
            image: data.appearance[0],
            animation: data.appearance[1],
        });
    };
}

function readExtraValues(key: string, value: string) {
    const tileSet = JSON.parse(fs.readFileSync(path.join(base, `${value}.json`), 'utf-8')) as TileSet;

    const names: string[] = [];

    const tileProperties = tileSet.tileproperties || {};
    for (const tileId of Object.keys(tileProperties)) {
        const props = tileProperties[tileId]!;
        const name = props.name;
        if (typeof name === 'string') {
            names.push(name);
        }
    }

    return names;
}
