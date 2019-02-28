import * as React from 'react';
import { Effect, EffectType } from '../../../common/components/CommonComponents';

interface Props {
    index: number;
    effect: Effect;
    onChange: (index: number, effect: Effect) => void;
    onRemove: (index: number) => void;
}

const EFFECT_TYPES: { [P in EffectType]: true } = {
    speed: true,
    alpha: true,
    poison: true,
    fire: true,
    ice: true,
    stone: true,
    light: true,
};

export class EffectEdit extends React.PureComponent<Props> {
    render(): React.ReactNode {
        const { effect } = this.props;

        return (
            <div>
                <button onClick={this.onRemove}>X</button>
                <select value={effect.type} onChange={this.onChangeType}>
                    {Object.keys(EFFECT_TYPES).map(type => (
                        <option key={type} value={type}>{type}</option>
                    ))}
                </select>
                <input className="small-input" type="number" step={0.05} value={effect.param}
                       onChange={this.onChangeParam}/>
            </div>
        );
    }

    private onChangeType = (e: React.SyntheticEvent<HTMLSelectElement>) => {
        const { index, effect, onChange } = this.props;

        onChange(index, {
            type: e.currentTarget.value as EffectType,
            param: effect.param,
        });
    };

    private onChangeParam = (e: React.SyntheticEvent<HTMLInputElement>) => {
        const { index, effect, onChange } = this.props;

        onChange(index, {
            type: effect.type,
            param: +e.currentTarget.value,
        });
    };

    private onRemove = () => {
        this.props.onRemove(this.props.index);
    };
}
