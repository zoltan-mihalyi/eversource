import * as fs from 'fs';
import * as path from 'path';
import * as React from 'react';
import { wwwDir } from '../Utils';
import { SimpleSelect } from './SimpleSelect';
import { Palettes } from '../../../client/src/game/Palettes';
import { ColoredImage } from '../../../common/domain/ColoredImage';
import { Appearance, Equipment } from '../../../common/domain/HumanoidEntityData';
import { getPaletteFile } from '../../../client/src/display/HumanoidDisplay';

interface Properties {
    [key: string]: ColoredImage | string;
}

type PropData = Appearance & Equipment;

interface Props {
    data: Properties;
    onChange: (data: any) => void;
}

const base = path.join(wwwDir, 'spritesheets', 'character');

function filesInDir(directory: string): string[] {
    return fs.readdirSync(path.join(base, directory))
        .filter(file => path.extname(file) !== '')
        .map(file => path.parse(file).name);
}

const possibleValues: { [P in keyof PropData]: string[] } = {
    sex: ['female', 'male'],
    body: filesInDir('body/female'),
    ears: ['bigears', 'elvenears'],
    eyes: filesInDir('body/female/eyes'),
    nose: ['bignose', 'buttonnose', 'straightnose'],
    chest: filesInDir('chest/female'),
    feet: filesInDir('feet/female'),
    hair: filesInDir('hair/female'),
    head: filesInDir('head/female'),
    legs: filesInDir('legs/female'),
    shirt: filesInDir('shirt/female'),
};

interface State {
    extraValues: { [P in keyof Properties]?: string[] };
}

export class PropTable extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        const extraValues: State['extraValues'] = {};
        for (const key of Object.keys(props.data) as (keyof PropData)[]) {
            if (key === 'sex') {
                continue;
            }
            extraValues[key] = readExtraValues(key, props.data[key][0]);
        }

        this.state = {
            extraValues,
        };
    }

    render() {
        const { data } = this.props;

        return (
            <table className="prop-table">
                <tbody>
                {(Object.keys(data) as (keyof PropData)[]).map((key) => (
                    <tr key={key}>
                        <td className="prop-name">{key}</td>
                        <td className="prop-value">
                            {this.renderPropValue(key)}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        )
    }

    private renderPropValue(key: keyof PropData) {
        const { data } = this.props;
        const { extraValues } = this.state;

        const values = possibleValues[key];
        const propValue = data[key];
        if (typeof propValue==='string') {
            return <SimpleSelect values={values} value={propValue} allowEmpty={false}
                                 onChange={val => this.setValue(key, val as PropData['sex'])}/>
        }

        return (
            <>
                <SimpleSelect allowEmpty={key !== 'body'} values={possibleValues[key]}
                              value={propValue[0]} onChange={v => {
                    this.setState({
                        extraValues: {
                            ...this.state.extraValues,
                            [key]: readExtraValues(key, v),
                        },
                    });
                    this.setValue(key, v === '' ? [] : [v])
                }}/>

                <SimpleSelect values={extraValues[key] || []} value={propValue[1]} allowEmpty={true}
                              onChange={v => {
                                  const primary = data[key][0];
                                  this.setValue(key, v === '' ? [primary] : [primary, v])
                              }}/>
            </>
        );
    }

    private setValue = <K extends keyof PropData>(key: K, value: PropData[K]) => {
        const { data, onChange } = this.props;

        onChange({
            ...data,
            [key]: value,
        });
    };
}

function readExtraValues(key: keyof PropData, value: string) {
    const filePath = `${base}/${getPaletteFile(key, value)}/palettes.json`;
    try {
        const palettes = JSON.parse(fs.readFileSync(filePath, 'utf-8')) as Palettes;
        return Object.keys(palettes.variations);
    } catch (e) {
        return [];
    }
}