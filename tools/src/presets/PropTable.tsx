import * as fs from 'fs';
import * as path from 'path';
import * as React from 'react';
import { wwwDir } from '../Utils';

interface Props {
    data: any;
    onChange: (data: any) => void;
}

const base = path.join(wwwDir, 'spritesheets', 'character');

function filesInDir(directory: string): string[] {
    return fs.readdirSync(path.join(base, directory))
        .filter(file => path.extname(file) !== '')
        .map(file => path.parse(file).name);
}

const possibleValues: { [key: string]: (string | null)[] } = {
    sex: ['female', 'male'],
    body: filesInDir('body/female'),
    ears: [null, 'bigears', 'elvenears'],
    eyes: [null, ...filesInDir('body/female/eyes')],
    nose: [null, 'bignose', 'buttonnose', 'straightnose'],
    chest: [null, ...filesInDir('chest/female')],
    feet: [null, ...filesInDir('feet/female')],
    hair: [null, ...filesInDir('hair/female')],
    head: [null, ...filesInDir('head/female')],
    legs: [null, ...filesInDir('legs/female')],
    shirt: [null, ...filesInDir('shirt/female')],
};

export class PropTable extends React.Component<Props> {
    render() {
        const { data } = this.props;

        return (
            <table className="prop-table">
                <tbody>
                {Object.keys(data).map((key) => (
                    <tr key={key}>
                        <td className="prop-name">{key}</td>
                        <td className="prop-value">
                            <select name={key} value={data[key] || ''} onChange={this.onChange}>
                                {possibleValues[key].map((value) => (
                                    <option key={value || ''} value={value || ''}>{value}</option>
                                ))}
                            </select>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        )
    }

    private onChange = (e: React.SyntheticEvent<HTMLSelectElement>) => {
        const { name, value } = e.currentTarget;

        const { data, onChange } = this.props;

        onChange({
            ...data,
            [name]: value || null,
        });
    };
}