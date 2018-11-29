import * as PIXI from 'pixi.js';
import { EntityData } from '../../../common/domain/EntityData';
import { OutlineFilter } from '@pixi/filter-outline';
import { GOLDEN } from './Cursors';
import { GameContext } from '../game/GameContext';

const properties: (keyof EntityData)[] = [
    'interaction',
    'name',
];

class SpriteContainer extends PIXI.Container {
    private isMouseOver = false;
    private outlineFilter = new OutlineFilter(1, 0xffff55);

    constructor(protected updatableDisplay: UpdatableDisplay<any>) {
        super();
        this.interactive = true;
        this.on('pointerdown', this.onClick);
        this.on('pointerover', this.onMouseOver);
        this.on('pointerout', this.onMouseOut);
        this.on('touchstart', this.onMouseOver);
        this.on('touchend', this.onMouseOut);
        this.on('touchendoutside', this.onMouseOut);
    }

    private onClick() {
        this.updatableDisplay.onClick();
    }

    private onMouseOver() {
        this.isMouseOver = true;
        this.updateMouseOverEffect();
    }

    private onMouseOut() {
        this.isMouseOver = false;
        this.updateMouseOverEffect();
    }

    updateMouseOverEffect() {
        this.updatableDisplay.updateMouseOverEffect(this.isMouseOver);

        if (this.isMouseOver && this.updatableDisplay.hasInteraction()) {
            this.filters = [this.outlineFilter];
            this.cursor = GOLDEN;
        } else {
            this.filters = [];
            this.cursor = '';
        }
    }
}

export abstract class UpdatableDisplay<T extends EntityData> extends PIXI.Container {
    protected readonly shadowContainer = new PIXI.Container();
    protected readonly spriteContainer: SpriteContainer;
    protected readonly textContainer = new PIXI.Container();
    protected readonly interactionContainer = new PIXI.Container();

    constructor(protected context: GameContext, protected data: T) {
        super();
        this.spriteContainer = new SpriteContainer(this);
        this.addChild(
            this.shadowContainer,
            this.spriteContainer,
            this.textContainer,
            this.interactionContainer,
        );
    }

    init() { // build and softUpdate can use child fields which are not initialized in parent constructor
        this.build();
        this.softUpdate();
    }

    update(changes: Partial<T>) {
        if (!this.matches(changes)) {
            const containers = [
                this.shadowContainer,
                this.spriteContainer,
                this.textContainer,
                this.interactionContainer,
            ];
            for (const container of containers) {
                const removed = container.removeChildren() as PIXI.Container[];
                for (const child of removed) {
                    child.destroy({ children: true });
                }
            }

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

    private build(): void {

        this.buildShadow();
        this.buildSprite();
        this.buildText();
        this.buildInteraction();

        this.spriteContainer.updateMouseOverEffect();
    }

    private buildText() {
        const { name } = this.data;
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
        this.textContainer.addChild(text);
    }

    protected buildShadow() {
    }

    protected buildInteraction() {
        const { interaction } = this.data;
        if (!interaction) {
            return;
        }
        const scale = 1 / interaction.length;
        let i = 0;
        for (const entityInteraction of interaction) {
            const q = this.context.textureLoader.createAnimatedSprite('misc', entityInteraction);
            q.y = -72; // TODO
            q.x = i * scale * 32;
            q.scale.set(scale);
            this.interactionContainer.addChild(q);
            i++;
        }
    }

    protected buildSprite() {
    }

    hasInteraction(): boolean {
        return this.data.interaction !== null;
    }

    updateMouseOverEffect(mouseOver: boolean) {
        this.textContainer.visible = mouseOver || this.alwaysShowName();
    }

    onClick() {
        this.context.onInteract(this);
    }

    protected abstract softUpdate(): void;
}
