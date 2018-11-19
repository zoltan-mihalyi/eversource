import { CreatureEntityData } from '../../../common/domain/CreatureEntityData';
import { UpdatableDisplay } from './UpdatableDisplay';
import * as PIXI from "pixi.js";

const HP_BAR_WIDTH = 60;

export abstract class CreatureDisplay<T extends CreatureEntityData> extends UpdatableDisplay<T> {
    protected abstract displayedProperties: (keyof T)[];

    protected buildShadow() {
        const shadow = this.context.textureLoader.createAnimatedSprite('misc', 'shadow');
        shadow.blendMode = PIXI.BLEND_MODES.MULTIPLY;
        this.shadowContainer.addChild(shadow);
    }

    protected buildStatus() {
        this.statusContainer.addChild(new PIXI.Graphics());
    }

    protected createAnimatedSprite(tileSet: string, image: string, paletteFile: string, color?: string) {
        const { direction, activity } = this.data;
        const animation = activity + ':' + direction;

        return this.context.textureLoader.createCustomAnimatedSprite(tileSet, image, animation, paletteFile, color);
    }

    protected softUpdate() {
        const speed = this.calculateAnimationSpeed();
        for (const child of this.spriteContainer.children) {
            (child as PIXI.extras.AnimatedSprite).animationSpeed = speed;
        }

        const hpGraphics = this.statusContainer.children[0] as PIXI.Graphics | undefined;

        if (hpGraphics) {
            hpGraphics.clear();

            hpGraphics.beginFill(0x888888);
            hpGraphics.drawRect(-HP_BAR_WIDTH / 2 - 1 + 16, -1, HP_BAR_WIDTH + 2, 4 + 2);

            hpGraphics.beginFill(0x000000);
            hpGraphics.drawRect(-HP_BAR_WIDTH / 2 + 16, 0, HP_BAR_WIDTH, 4);

            hpGraphics.beginFill(0x00CC2C);
            hpGraphics.drawRect(-HP_BAR_WIDTH / 2 + 16, 0, this.data.hp / this.data.maxHp * HP_BAR_WIDTH, 4);
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