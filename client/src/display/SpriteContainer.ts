import * as PIXI from 'pixi.js';
import { OutlineFilter } from '@pixi/filter-outline';
import { AdjustmentFilter } from '@pixi/filter-adjustment';
import AdjustmentOptions = PIXI.filters.AdjustmentOptions;

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

export interface SpriteInteractionHandler {
    onClick: () => void;
    onMouseOverChange: (over: boolean) => void;
}

export class SpriteContainer extends PIXI.Container {
    private isMouseOver = false; // TODO refactor
    private outlineFilter = new OutlineFilter(2, 0xffff55);
    private adjustmentFilter = new AdjustmentFilter();
    private interactable = false;

    private effectFilters: PIXI.Filter<any>[] = [];
    private adjustmentOptions: AdjustmentOptions = {};

    constructor(private handler: SpriteInteractionHandler) {
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
        this.handler.onClick();
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
        this.handler.onMouseOverChange(this.isMouseOver);
        this.updateFilters();
    }

    setEffectFilters(filters: PIXI.Filter<any>[], adjustmentOptions: AdjustmentOptions) {
        this.effectFilters = filters;
        this.adjustmentOptions = adjustmentOptions;
        this.updateFilters();
    }

    setInteractable(interactable: boolean) {
        this.interactable = interactable;
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
            if (this.interactable) {
                filters.push(this.outlineFilter);
            }
            this.adjustmentFilter.gamma *= 1.3;
        }
        this.filters = filters.length > 0 ? filters : null;
    }
}
