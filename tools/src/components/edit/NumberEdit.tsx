import { EditProps } from './Edit';
import * as React from 'react';

export class NumberEdit extends React.PureComponent<EditProps<number>> {
    render() {
        return (
            <input type="number" value={this.props.value} onChange={this.onChange}/>
        );
    }

    private onChange = (e: React.SyntheticEvent<HTMLInputElement>) => {
        this.props.onChange(+e.currentTarget.value);
    }

}
