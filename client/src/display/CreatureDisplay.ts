import { CreatureEntityData } from '../../../common/domain/CreatureEntityData';
import { UpdatableDisplay } from './UpdatableDisplay';
import * as PIXI from "pixi.js";

export abstract class CreatureDisplay<T extends CreatureEntityData> extends UpdatableDisplay<T> {
    protected abstract displayedProperties: (keyof T)[];

    protected build() {
        this.createShadow();
        super.build();
    }

    protected createShadow() {
        const shadow = this.context.textureLoader.createAnimatedSprite('misc', 'shadow');
        shadow.blendMode = PIXI.BLEND_MODES.MULTIPLY;
        this.addChild(shadow);
    }

    protected createAnimatedSprite(tileSet: string, image: string, paletteFile: string, color?: string) {
        const { direction, activity } = this.data;
        const animation = activity + ':' + direction;

        return this.context.textureLoader.createCustomAnimatedSprite(tileSet, image, animation, paletteFile, color);
    }

    protected softUpdate() {
        const speed = this.calculateAnimationSpeed();
        for (const child of this.children) {
            (child as PIXI.extras.AnimatedSprite).animationSpeed = speed;
        }
    }

    protected calculateAnimationSpeed(): number {
        switch (this.data.activity) {
            case 'standing':
                return 0.08;
            case 'walking':
                return this.data.activitySpeed / 16;
            case 'casting':
                return 0.25;
        }
    }

    protected matches(changes: Partial<T>): boolean {
        if (!super.matches(changes)) {
            return false;
        }
        for (const property of this.displayedProperties) {
            if (changes.hasOwnProperty(property) && changes[property] !== this.data[property]) {
                return false;
            }
        }
        return true;
    }

    protected alwaysShowName() {
        return this.data.player;
    }

    protected nameColor() {
        if (this.data.player) {
            return '#6e96db';
        }
        return super.nameColor();
    }
}