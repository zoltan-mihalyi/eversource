import * as PIXI from 'pixi.js';
import { EntityData, EntityId } from '../../../common/domain/EntityData';
import { OutlineFilter } from '@pixi/filter-outline';
import { GOLDEN } from './Cursors';
import { AdjustmentFilter } from '@pixi/filter-adjustment';
import { GameContext } from '../game/GameContext';
import DestroyOptions = PIXI.DestroyOptions;
import AdjustmentOptions = PIXI.filters.AdjustmentOptions;
import { black, brown } from '../components/theme';

const properties: (keyof EntityData)[] = [
    'interaction',
    'name',
];

const ADJUSTMENT_KEYS: (keyof AdjustmentOptions)[] = [
    'gamma',
    'contrast',
    'saturation',
    'brightness',
    'red',
    'green',
    'blue',
    'alpha',
];

class SpriteContainer extends PIXI.Container {
    private isMouseOver = false;
    private outlineFilter = new OutlineFilter(2, 0xffff55);
    private adjustmentFilter = new AdjustmentFilter();

    private effectFilters: PIXI.Filter<any>[] = [];
    private adjustmentOptions: AdjustmentOptions = {};

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
            this.updateFilters();
            this.cursor = GOLDEN;
        } else {
            this.updateFilters();
            this.cursor = '';
        }
    }

    setEffectFilters(filters: PIXI.Filter<any>[], adjustmentOptions: AdjustmentOptions) {
        this.effectFilters = filters;
        this.adjustmentOptions = adjustmentOptions;
        this.updateFilters();
    }

    private updateFilters() {
        const filters: PIXI.Filter<any>[] = this.effectFilters.slice();

        if (this.isMouseOver || Object.keys(this.adjustmentOptions).length > 0) {
            for (const key of ADJUSTMENT_KEYS) {
                const value = this.adjustmentOptions[key];
                this.adjustmentFilter[key] = value === void 0 ? 1 : value;
            }
            filters.push(this.adjustmentFilter);
        }


        if (this.isMouseOver) {
            if (this.updatableDisplay.hasInteraction()) {
                filters.push(this.outlineFilter);
            }
            this.adjustmentFilter.gamma *= 1.3;
        }
        this.filters = filters.length > 0 ? filters : null;
    }
}

export abstract class UpdatableDisplay<T extends EntityData> extends PIXI.Container {
    protected readonly shadowContainer = new PIXI.Container();
    protected readonly spriteContainer: SpriteContainer;
    protected readonly statusContainer = new PIXI.Container();
    protected readonly textContainer = new PIXI.Container();
    protected readonly interactionContainer = new PIXI.Container();

    constructor(private id: EntityId, protected context: GameContext, protected data: T) {
        super();
        this.spriteContainer = new SpriteContainer(this);
        this.addChild(
            this.shadowContainer,
            this.spriteContainer,
            this.statusContainer,
            this.textContainer,
            this.interactionContainer,
        );
        PIXI.ticker.shared.add(this.updateStackingElementsPosition, this);
    }

    init() { // build and softUpdate can use child fields which are not initialized in parent constructor
        this.build();
        this.softUpdate();
    }

    destroy(options?: DestroyOptions | boolean) {
        super.destroy(options);
        PIXI.ticker.shared.remove(this.updateStackingElementsPosition, this);
    }

    update(changes: Partial<T>) {
        if (!this.matches(changes)) {
            this.data = {
                ...this.data as any,
                ...changes as any,
            };
            this.rebuild();
        } else {
            Object.assign(this.data, changes);
            this.softUpdate();
        }
    }

    protected alwaysShowName(): boolean {
        return false;
    }

    protected nameColor(): string {
        return brown.lighter;
    }

    protected matches(changes: Partial<T>): boolean {
        for (const property of properties) {
            if (changes.hasOwnProperty(property) && changes[property] !== this.data[property]) {
                return false;
            }
        }
        return true;
    }

    protected rebuild(){
        const containers = [
            this.shadowContainer,
            this.spriteContainer,
            this.statusContainer,
            this.textContainer,
            this.interactionContainer,
        ];
        for (const container of containers) {
            const removed = container.removeChildren() as PIXI.Container[];
            for (const child of removed) {
                child.destroy({ children: true });
            }
        }
        this.build();
        this.softUpdate();
    }

    private build(): void {

        this.buildShadow();
        this.buildSprite();
        this.buildStatus();
        this.buildText();
        this.buildInteraction();

        this.updateStackingElementsPosition();

        this.spriteContainer.updateMouseOverEffect();
    }

    protected getText(){
        return this.data.name;
    }

    private buildText() {
        const name = this.getText();
        const text = new PIXI.Text(name, {
            fontFamily: 'pixel, serif',
            fontSize: 32,
            fill: this.nameColor(),
            stroke: black,
            strokeThickness: 1.4,
            align: 'left',
        });
        text.scale.set(0.5);
        text.x = -Math.floor(text.width / 2); // avoid blurry text
        this.textContainer.addChild(text);
    }

    private updateStackingElementsPosition() {
        const spriteTop = this.spriteContainer.scale.y * this.spriteContainer.getLocalBounds().y;
        this.statusContainer.y = spriteTop - this.statusContainer.height;
        this.textContainer.y = this.statusContainer.y - 17;
        this.interactionContainer.y = this.textContainer.y;
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
            q.x = (i - (interaction.length - 1) / 2) * scale * 20;
            q.y = -scale * 6;
            q.scale.set(scale);
            this.interactionContainer.addChild(q);
            i++;
        }
    }

    protected buildSprite() {
    }

    protected buildStatus() {
    }

    hasInteraction(): boolean {
        return this.data.interaction !== null;
    }

    updateMouseOverEffect(mouseOver: boolean) {
        const visible = mouseOver || this.alwaysShowName();
        this.textContainer.visible = visible;
        this.statusContainer.visible = visible;
    }

    onClick() {
        this.context.playingNetworkApi.interact(this.id);
    }

    protected abstract softUpdate(): void;
}
