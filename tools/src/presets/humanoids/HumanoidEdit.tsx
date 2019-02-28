import * as React from 'react';
import { EditProps } from '../ShowPreset';
import { HumanoidPreset } from '../../../../server/src/world/Presets';
import { PropTable } from '../PropTable';
import * as path from "path";
import { wwwDir } from '../../Utils';
import { DirectoryReader, getVariations } from '../utils';
import { Appearance, Equipment } from '../../../../common/components/View';
import { getPaletteFile } from '../../../../client/src/display/HumanoidSprite';

const base = path.join(wwwDir, 'spritesheets', 'character');
const reader = new DirectoryReader(base);

const appearanceValues: { [P in keyof Appearance]: string[] } = {
    sex: ['female', 'male'],
    body: reader.filesInDir('body/female'),
    ears: ['bigears', 'elvenears'],
    eyes: reader.filesInDir('eyes/female'),
    nose: ['bignose', 'buttonnose', 'straightnose'],
    facial: reader.filesInDir('facial/female'),
    hair: reader.filesInDir('hair/female'),
};

const equipmentValues: { [P in keyof Equipment]: string[] } = {
    cape: reader.filesInDir('cape/female'),
    belt: reader.filesInDir('belt/female'),
    chest: reader.filesInDir('chest/female'),
    feet: reader.filesInDir('feet/female'),
    head: reader.filesInDir('head/female'),
    legs: reader.filesInDir('legs/female'),
    arms: reader.filesInDir('arms/female'),
    hands: reader.filesInDir('hands/female'),
    shirt: reader.filesInDir('shirt/female'),
    mask: reader.filesInDir('mask/female'),
};

export class HumanoidEdit extends React.PureComponent<EditProps<HumanoidPreset>> {
    render() {
        const { preset } = this.props;

        return (
            <>
                <PropTable data={preset.appearance} values={appearanceValues} readExtraValues={readExtraValues}
                           onChange={this.onChangeAppearance} forceSelect={['body']}/>
                <PropTable data={preset.equipment} values={equipmentValues} readExtraValues={readExtraValues}
                           onChange={this.onChangeEquipment} forceSelect={[]}/>
            </>
        );
    }

    private onChangeAppearance = (data: Appearance) => {
        this.props.onChange({ appearance: data });
    };

    private onChangeEquipment = (data: Equipment) => {
        this.props.onChange({ equipment: data });
    };
}

function readExtraValues(key: string, value: string) {
    return getVariations(`${base}/${getPaletteFile(key, value)}/palettes.json`);
}