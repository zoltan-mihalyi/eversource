import { EntityContainer, Query } from '../../../../common/es/EntityContainer';
import { ClientComponents } from '../../es/ClientComponents';
import { EventBus } from '../../../../common/es/EventBus';
import { ClientEvents, CreateDisplayEvent } from '../../es/ClientEvents';
import * as PIXI from 'pixi.js';
import { Metric } from './Metric';
import { Position } from '../../../../common/domain/Location';

export class DisplayPositionSystem {
    private nextId = 0;
    private displayOrder = new Map<PIXI.DisplayObject, number>();
    private positions: Query<ClientComponents, 'position' | 'display'>;

    constructor(private objectContainer: PIXI.Container, private metric: Metric,
                container: EntityContainer<ClientComponents>, eventBus: EventBus<ClientEvents>) {

        this.positions = container.createQuery('position', 'display');

        this.positions.on('add', ({ display, position }) => eventBus.emit('createDisplay', { display, position }));
        this.positions.on('remove', ({ display }) => eventBus.emit('removeDisplay', display));
        this.positions.on('update', ({ display, position }) => this.updatePosition(display, position));

        eventBus.on('createDisplay', this.onCreateDisplay.bind(this));
        eventBus.on('removeDisplay', this.onRemoveDisplay.bind(this));

        eventBus.on('render', this.onRender.bind(this));
    }

    private onCreateDisplay({ display, position }: CreateDisplayEvent) {
        this.displayOrder.set(display, this.nextId++);
        this.updatePosition(display, position);
    }

    private onRemoveDisplay(display: PIXI.DisplayObject) {
        this.displayOrder.delete(display);
    }

    private updatePosition(display: PIXI.DisplayObject, position: Position) {
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


