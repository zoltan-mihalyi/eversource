import * as React from 'react';
import { CreaturePreset, PresetAttitude } from '../../../server/src/world/Presets';
import { EditPresetProps } from './ShowPreset';

interface Props<T extends CreaturePreset> extends EditPresetProps<T>{
}

export class CreatureEdit<T extends CreaturePreset> extends React.PureComponent<Props<T>> {
    render() {
        const { preset } = this.props;

        return (
            <>
                <span className="prop-name">level </span>
                <input className="small-input" value={preset.level} type="number" min="1" step="1"
                       onChange={this.changeLevel}/>
                {' '}
                <select value={preset.attitude} onChange={this.changeAttitude}>
                    <option value="friendly">Friendly</option>
                    <option value="neutral">Neutral</option>
                    <option value="hostile">Hostile</option>
                </select>
            </>
        );
    }

    private changeLevel = (e: React.SyntheticEvent<HTMLInputElement>) => {
        this.props.onChange({
            level: +e.currentTarget.value,
        } as Partial<T>);
    };

    private changeAttitude = (e: React.SyntheticEvent<HTMLSelectElement>) => {
        this.props.onChange({
            attitude: e.currentTarget.value as PresetAttitude,
        } as Partial<T>);
    };
}
