import * as React from 'react';
import { EditProps } from './Edit';

export class TextEdit extends React.PureComponent<EditProps<string>> {
    render() {
        return (
            <input value={this.props.value} onChange={this.onChange}/>
        );
    }

    private onChange = (e: React.SyntheticEvent<HTMLInputElement>) => {
        this.props.onChange(e.currentTarget.value);
    }
}
