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
import * as PIXI from "pixi.js";

const DIRECTIONS: Direction[] = [
    'right',
    'down',
    'left',
    'up',
];

export interface DisplayScreenComponents {
    container: EntityContainer<ClientComponents>;
    eventBus: EventBus<ClientEvents>;
    objectContainer: PIXI.Container;
    entity: Entity<ClientComponents>;
}

interface Props {
    template: Partial<ClientComponents>;
    backgroundColor?: number;
}

const metric = new Metric(32, 32);
metric.scale = 2;

export class DisplayScreen extends React.PureComponent<Props> {
    private readonly screenComponents: DisplayScreenComponents;

    constructor(props: Props) {
        super(props);
        this.screenComponents = createDisplayScreenComponents(props.template);
    }

    render() {
        const { objectContainer, eventBus } = this.screenComponents;

        return (
            <TestScreen display={objectContainer} eventBus={eventBus} backgroundColor={this.props.backgroundColor}/>
        );
    }
}

export function createDisplayScreenComponents(template?: Partial<ClientComponents>): DisplayScreenComponents {
    const container = new EntityContainer<ClientComponents>();
    const eventBus = new EventBus<ClientEvents>();
    const objectContainer = completeDisplaySystem(container, eventBus, metric, textureLoader);
    const entity = container.createEntityWithId(0 as EntityId, template);

    eventBus.on('interact', () => {
        const direction = entity.components.direction;
        if (!direction) {
            return;
        }
        entity.set('direction', nextValue(DIRECTIONS, direction));
    });

    return {
        container,
        entity,
        eventBus,
        objectContainer,
    };
}