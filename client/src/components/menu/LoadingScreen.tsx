import * as React from 'react';
import { Gui } from '../common/Gui';
import { Centered } from '../common/Centered';
import { Panel } from '../common/Panel';
import { ZoneName } from '../character/ZoneName';

interface Props {
    zone: string;
}

export class LoadingScreen extends React.Component<Props> {
    render() {
        return (
            <Gui>
                <Centered>
                    <Panel margin padding>
                        <h2>Loading...</h2>
                        <ZoneName zone={this.props.zone}/>
                    </Panel>
                </Centered>
            </Gui>
        );
    }
}
