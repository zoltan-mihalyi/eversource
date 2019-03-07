import * as React from 'react';
import { EditComponent } from './Edit';
import { Omit } from '../../../../common/util/Omit';

interface PropertyEditProps<T, K extends keyof T> {
    object: T;
    property: K;
    EditComponent: EditComponent<T[K]>;
    onChange: (object: T) => void;
}

class PropertyEdit<T, K extends keyof T> extends React.PureComponent<PropertyEditProps<T, K>> {
    render() {
        const { object, property, EditComponent } = this.props;

        return (
            <div style={{ display: 'flex', marginTop: 10, marginBottom: 10 }}>
                <div>
                    <span className="prop-name">{property} </span>
                </div>
                <div>
                    <EditComponent value={object[property]} onChange={this.onChange}/>
                </div>
            </div>
        );
    }

    private onChange = (value: T[K]) => {
        const { object, property } = this.props;

        this.props.onChange({ ...object as any, [property]: value });
    }
}


export type PropertyConfig<T> = {
    [P in keyof T]: { component: EditComponent<T[P]> };
}

export function objectEdit<T, O extends keyof T = never>(config: PropertyConfig<Omit<T, O>>): EditComponent<T> {
    return ({ value, onChange }) => (
        <div>
            {(Object.keys(config) as (keyof (Omit<T, O>) & string)[]).map(<K extends keyof (Omit<T, O>) & string>(key: K) => (
                <PropertyEdit key={key} property={key} object={value} EditComponent={config[key].component} onChange={onChange as any}/>
            ))}
        </div>
    );
}
