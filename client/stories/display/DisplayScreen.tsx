import { ClientComponents } from '../../src/es/ClientComponents';
import { EntityContainer } from '../../../common/es/EntityContainer';
import { EventBus } from '../../../common/es/EventBus';
import { ClientEvents } from '../../src/es/ClientEvents';
import { nextValue } from '../../../common/util/utils';
import { completeDisplaySystem } from '../../src/systems/display/CompleteDisplaySystem';
import { Metric } from '../../src/systems/display/Metric';
import { textureLoader } from '../SampleData';
import { Entity, EntityId } from '../../../common/es/Entity';
import { TestScreen } from './TestScreen';
import * as React from 'react';
import { Direction } from '../../../common/components/CommonComponents';

const DIRECTIONS: Direction[] = [
    'right',
    'down',
    'left',
    'up',
];

interface Props {
    template: Partial<ClientComponents>;
}

const metric = new Metric(32, 32);
metric.scale = 2;

export class DisplayScreen extends React.PureComponent<Props> {
    private container = new EntityContainer<ClientComponents>();
    private eventBus = new EventBus<ClientEvents>();
    private objectContainer = completeDisplaySystem(this.container, this.eventBus, metric, textureLoader);

    private entity: Entity<ClientComponents>;

    constructor(props: Props) {
        super(props);

        this.eventBus.on('interact', () => {
            const direction = this.entity.components.direction;
            if (!direction) {
                return;
            }
            this.entity.set('direction', nextValue(DIRECTIONS, direction));
        });

        this.entity = this.container.createEntityWithId(0 as EntityId, props.template);
    }

    render() {
        return (
            <TestScreen display={this.objectContainer} eventBus={this.eventBus} backgroundColor={0xffcc88}/>
        );
    }
}