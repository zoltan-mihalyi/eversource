import * as PIXI from 'pixi.js';
import { EntityData } from '../../../common/domain/EntityData';
import { OutlineFilter } from '@pixi/filter-outline';
import { GOLDEN } from './Cursors';
import { GameContext } from '../game/GameContext';

const properties: (keyof EntityData)[] = [
    'interaction',
    'name',
];

export abstract class UpdatableDisplay<T extends EntityData> extends PIXI.Container {
    private outlineFilter = new OutlineFilter(1, 0xffffff);
    private isMouseOver = false;
    private text!: PIXI.Text;

    constructor(protected context: GameContext, protected data: T) {
        super();
        this.interactive = true;
        this.on('pointerdown', this.onClick);
        this.on('pointerover', this.onMouseOver);
        this.on('pointerout', this.onMouseOut);
        this.on('touchstart', this.onMouseOver);
        this.on('touchend', this.onMouseOut);
        this.on('touchendoutside', this.onMouseOut);
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

    protected alwaysShowName(): boolean {
        return false;
    }

    protected nameColor(): string {
        return '#ccbd7b';
    }

    protected matches(changes: Partial<T>): boolean {
        for (const property of properties) {
            if (changes.hasOwnProperty(property) && changes[property] !== this.data[property]) {
                return false;
            }
        }
        return true;
    }

    protected build(): void {
        const { name, interaction } = this.data;
        const text = new PIXI.Text(name, {
            fontFamily: 'pixel, serif',
            fontSize: 16,
            fill: this.nameColor(),
            stroke: '#000000',
            strokeThickness: 0.7,
            align: 'left',
        });
        text.x = 32 / 2 - Math.floor(text.width / 2); // avoid blurry text
        text.y = -50; // TODO
        text.interactive = false;
        this.text = this.addChild(text);

        if (interaction) {
            const scale = 1 / interaction.length;
            let i = 0;
            for (const entityInteraction of interaction) {
                const q = this.context.textureLoader.createAnimatedSprite('misc', entityInteraction);
                q.y = -72; // TODO
                q.x = i * scale * 32;
                q.scale.set(scale);
                this.addChild(q);
                i++;
            }
        }
        this.updateMouseOverEffect();
    }

    private updateMouseOverEffect() {
        this.text.visible = this.isMouseOver || this.alwaysShowName();

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
