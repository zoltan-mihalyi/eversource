import * as PIXI from 'pixi.js';
import { EntityData } from '../../../common/domain/EntityData';
import { OutlineFilter } from '@pixi/filter-outline';
import { GOLDEN } from './Cursors';
import { GameContext } from '../game/GameContext';

export abstract class UpdatableDisplay<T extends EntityData> extends PIXI.Container {
    private outlineFilter = new OutlineFilter(1, 0xffffff);
    private isMouseOver = false;

    constructor(protected context: GameContext, protected data: T) {
        super();
        this.interactive = true;
        this.on('pointerdown', this.onClick);
        this.on('mouseover', this.onMouseOver);
        this.on('mouseout', this.onMouseOut);
    }

    init() { // build and softUpdate can use child fields which are not initialized in parent constructor
        this.build();
        this.softUpdate();
    }

    update(changes: Partial<T>) {
        if (!this.matches(changes)) {
            for (const child of this.children) {
                child.destroy();
            }
            this.removeChildren();
            this.data = {
                ...this.data as any,
                ...changes as any,
            };
            this.build();
        } else {
            Object.assign(this.data, changes);
        }
        this.softUpdate();
    }

    protected matches(changes: Partial<T>): boolean {
        return !(changes.hasOwnProperty('interaction') && changes.interaction !== this.data.interaction);
    }

    protected build(): void {
        const { interaction } = this.data;
        if (interaction) {
            const scale = 1 / interaction.length;
            let i = 0;
            for (const entityInteraction of interaction) {
                const q = this.context.textureLoader.createAnimatedSprite('misc', entityInteraction);
                q.y = -60; // TODO
                q.x = i * scale * 32;
                q.scale.set(scale);
                this.addChild(q);
                i++;
            }
        }
        this.updateMouseOverEffect();
    }

    private updateMouseOverEffect() {
        if (this.isMouseOver && this.data.interaction) {
            this.filters = [this.outlineFilter];
            this.cursor = GOLDEN;
        } else {
            this.filters = [];
            this.cursor = '';
        }
    }

    onClick() {
        this.context.onInteract(this);
    }

    private onMouseOver() {
        this.isMouseOver = true;
        this.updateMouseOverEffect();
    }

    private onMouseOut() {
        this.isMouseOver = false;
        this.updateMouseOverEffect();
    }

    protected abstract softUpdate(): void;
}
