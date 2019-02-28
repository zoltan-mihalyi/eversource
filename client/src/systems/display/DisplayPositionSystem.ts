import { EntityContainer, Query } from '../../../../common/es/EntityContainer';
import { ClientComponents } from '../../es/ClientComponents';
import { PartialPick } from '../../../../common/util/Types';
import { EventBus } from '../../../../common/es/EventBus';
import { ClientEvents } from '../../es/ClientEvents';
import * as PIXI from 'pixi.js';
import { Metric } from './Metric';

export class DisplayPositionSystem {
    private nextId = 0;
    private displayOrder = new Map<PIXI.DisplayObject, number>();
    private positions: Query<ClientComponents, 'position' | 'display'>;

    constructor(private objectContainer: PIXI.Container, private metric: Metric,
                container: EntityContainer<ClientComponents>, eventBus: EventBus<ClientEvents>) {

        this.positions = container.createQuery('position', 'display');

        this.positions.on('add', this.onAdd.bind(this));
        this.positions.on('remove', this.onRemove.bind(this));
        this.positions.on('update', this.updatePosition.bind(this));
        eventBus.on('render', this.onRender.bind(this));
    }

    private onAdd(components: PartialPick<ClientComponents, 'position' | 'display'>) {
        this.displayOrder.set(components.display, this.nextId++);
        this.updatePosition(components);
    }

    private onRemove({ display }: PartialPick<ClientComponents, 'display'>) {
        this.displayOrder.delete(display);
    }

    private updatePosition({ position, display }: PartialPick<ClientComponents, 'position' | 'display'>) {
        const { x, y } = this.metric.toFragmentPosition(position);
        display.position.set(x, y);
    }

    private onRender() {
        this.updateStackingElementsPosition();
        this.sortDisplays();
    }

    private updateStackingElementsPosition() {
        this.positions.forEach(({ display }) => {
            display.updateStackingElementsPosition();
        });
    }

    private sortDisplays() {
        this.objectContainer.children.sort((a, b) => {
            const difference = a.position.y - b.position.y;
            if (difference === 0) {
                return this.displayOrder.get(a)! - this.displayOrder.get(b)!;
            }
            return difference;
        });
    }
}


