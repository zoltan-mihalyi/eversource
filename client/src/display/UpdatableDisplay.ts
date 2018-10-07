import * as PIXI from "pixi.js";
import { TextureLoader } from '../map/TextureLoader';

export abstract class UpdatableDisplay<T> extends PIXI.Container {
    constructor(protected textureLoader: TextureLoader, protected data: T) {
        super();
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

    protected abstract matches(changes: Partial<T>): boolean;

    protected abstract build(): void;

    protected abstract softUpdate(): void;
}
