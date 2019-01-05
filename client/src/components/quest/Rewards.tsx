import * as React from 'react';
import { Enumeration } from '../common/Enumeration';

export const Rewards: React.FunctionComponent<{}> = () => (
    <>

        <h3>Rewards</h3>
        <Enumeration>
            <li>Experience: 200</li>
            <li>Gold: 50</li>
        </Enumeration>
    </>
);