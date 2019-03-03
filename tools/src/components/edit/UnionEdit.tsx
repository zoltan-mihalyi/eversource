import { EditComponent, EditProps } from './Edit';
import * as React from 'react';

interface Typed {
    type: string;
}

type SubTyped<T extends Typed, K extends string> = Extract<T, { type: K }>

type UnionConfig<T extends Typed> = {
    [P in T['type']]: {
        component: () => EditComponent<SubTyped<T, P>>;
        defaultValue: SubTyped<T, P>;
    };
};

type ResolvedUnionConfig<T extends Typed> = {
    [P in T['type']]: {
        component: EditComponent<SubTyped<T, P>>;
        defaultValue: SubTyped<T, P>;
    };
};

interface UnionEditProps<T extends Typed> extends EditProps<T> {
    config: ResolvedUnionConfig<T>;
}

class UnionEdit<T extends Typed> extends React.PureComponent<UnionEditProps<T>> {
    render() {
        const { config, value, onChange } = this.props;

        const typeConfig = config[value.type as T['type']];
        const Edit = typeConfig.component;

        return (
            <div style={{ flexGrow: 1 }}>
                <select value={value.type} onChange={this.changeType}>
                    {Object.keys(config).map((type) =>
                        <option key={type}>{type}</option>
                    )}
                </select>
                <div>
                    <Edit value={value as SubTyped<T, T['type']>} onChange={onChange}/>
                </div>
            </div>
        );
    }

    private changeType = (e: React.SyntheticEvent<HTMLSelectElement>) => {
        const { onChange, config } = this.props;

        onChange(config[e.currentTarget.value as T['type']].defaultValue);
    }
}

export function unionEdit<T extends Typed>(config: UnionConfig<T>): EditComponent<T> {
    let resolvedConfig: ResolvedUnionConfig<T>;

    return ({ value, onChange }) => {
        if (!resolvedConfig) {
            resolvedConfig = resolveConfig(config);
        }

        return (
            <UnionEdit config={resolvedConfig} value={value} onChange={onChange}/>
        );
    };
}

function resolveConfig<T extends Typed>(config: UnionConfig<T>): ResolvedUnionConfig<T> {
    const result = {} as ResolvedUnionConfig<T>;
    for (const key of Object.keys(config) as (T['type'])[]) {
        const configElement = config[key];
        result[key] = {
            component: configElement.component(),
            defaultValue: configElement.defaultValue,
        };
    }

    return result;
}
