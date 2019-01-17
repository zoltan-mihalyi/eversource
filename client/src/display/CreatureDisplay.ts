import { CreatureAttitude, CreatureEntityData } from '../../../common/domain/CreatureEntityData';
import { UpdatableDisplay } from './UpdatableDisplay';
import * as PIXI from "pixi.js";
import { GameContext } from '../game/GameContext';
import { EntityId } from '../../../common/domain/EntityData';
import { EffectCache } from '../effects/EffectCache';
import { AdjustmentOptions } from '@pixi/filter-adjustment'

const HP_BAR_WIDTH = 60;

export abstract class CreatureDisplay<T extends CreatureEntityData> extends UpdatableDisplay<T> {
    protected abstract displayedProperties: (keyof T)[];
    private effectCache = new EffectCache();

    constructor(id: EntityId, context: GameContext, data: T, private self: boolean) {
        super(id, context, data);
    }

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
        this.updateEffects();

        this.spriteContainer.scale.set(this.data.scale);
        this.shadowContainer.scale.set(this.data.scale);

        const hpGraphics = this.statusContainer.children[0] as PIXI.Graphics | undefined;

        if (hpGraphics) {
            hpGraphics.clear();

            hpGraphics.beginFill(0x555555);
            hpGraphics.drawRect(-HP_BAR_WIDTH / 2 - 1, -1, HP_BAR_WIDTH + 2, 4 + 2);

            hpGraphics.beginFill(0x000000);
            hpGraphics.drawRect(-HP_BAR_WIDTH / 2, 0, HP_BAR_WIDTH, 4);

            hpGraphics.beginFill(attitudeColor(this.self, this.data.attitude));
            hpGraphics.drawRect(-HP_BAR_WIDTH / 2, 0, this.data.hp / this.data.maxHp * HP_BAR_WIDTH, 4);
        }
    }

    private updateEffects() {
        const effectFilters: PIXI.Filter<any>[] = [];
        const adjustmentOptions: AdjustmentOptions = {};

        for (const effect of this.data.effects) {
            switch (effect.type) {
                case 'speed': {
                    const [vx, vy] = directionVelocity(this.data);
                    const str = effect.param * this.getBounds().width * 0.1;
                    effectFilters.push(this.effectCache.getSpeedEffect(vx * str, vy * str));
                    break;
                }
                case 'alpha':
                    setOptions(adjustmentOptions, {
                        alpha: effect.param,
                    });
                    break;
                case 'poison':
                    setOptions(adjustmentOptions, {
                        red: 0.3,
                        green: 0.7,
                        blue: 0.2,
                    });
                    break;
                case 'fire':
                    setOptions(adjustmentOptions, {
                        blue: 0,
                        green: 0.3,
                    });
                    break;
                case 'ice':
                    setOptions(adjustmentOptions, {
                        green: 0.6,
                        red: 0.3,
                    });
                    break;
                case 'stone':
                    setOptions(adjustmentOptions, {
                        saturation: 0,
                        contrast: 0.6,
                    });
                    break;
                case 'light':
                    setOptions(adjustmentOptions, {
                        gamma: 1.3,
                        brightness: 1.2,
                        red: 1.5,
                        green: 1.3,
                    });
                    break;
            }
        }

        this.spriteContainer.setEffectFilters(effectFilters, adjustmentOptions);
    }

    protected calculateAnimationSpeed(): number {
        switch (this.data.activity) {
            case 'standing':
                return 0.08;
            case 'walking':
                return this.data.activitySpeed / 16 / this.data.scale;
            case 'casting':
                return 0.25;
        }
    }

    protected matches(changes: Partial<T>): boolean {
        if (!super.matches(changes)) {
            return false;
        }
        for (const property of ['level' as 'level', ...this.displayedProperties]) {
            if (changes.hasOwnProperty(property) && changes[property] !== this.data[property]) {
                return false;
            }
        }
        return true;
    }

    protected alwaysShowName() {
        return this.data.player;
    }

    protected getText(){
        return `[${this.data.level}] ${super.getText()}`;
    }

    protected nameColor() {
        if (this.data.player) {
            return '#6e96db';
        }
        return super.nameColor();
    }
}

function attitudeColor(self: boolean, attitude: CreatureAttitude): number {
    if (self) {
        return 0x00CC2C;
    }
    switch (attitude) {
        case CreatureAttitude.FRIENDLY:
            return 0x6e96db;
        case CreatureAttitude.NEUTRAL:
            return 0xe1e000;
        case CreatureAttitude.HOSTILE:
            return 0xcc0000;
    }
}

function directionVelocity(data: CreatureEntityData): [number, number] {
    const { direction, activity } = data;

    if (activity !== 'walking') {
        return [0, 0];
    }

    switch (direction) {
        case 'left':
            return [-1, 0];
        case 'up':
            return [0, -1];
        case 'right':
            return [1, 0];
        case 'down':
            return [0, 1];
    }
}

function setOptions(options: AdjustmentOptions, values: Partial<AdjustmentOptions>) {
    for (const key of Object.keys(values) as (keyof AdjustmentOptions)[]) {
        const value = values[key]!;
        const existing = options[key];
        options[key] = existing === void 0 ? value : existing * value;
    }
}