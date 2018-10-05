import { MonsterEntityData } from '../../../common/domain/MonsterEntityData';
import { CreatureDisplay } from './CreatureDisplay';
import * as PIXI from "pixi.js";

const DISPLAYED_PROPERTIES: (keyof MonsterEntityData)[] = [
    'image',
    'palette',
    'direction',
    'activity',
];

export class MonsterDisplay extends CreatureDisplay<MonsterEntityData> {
    protected displayedProperties = DISPLAYED_PROPERTIES;
    private fixAnimationSpeed: number | null = null;

    protected build() {
        const shadowContainer = new PIXI.Container();
        this.addChild(shadowContainer);

        const { image, palette } = this.data;

        const directory = `monster/${image}`;
        const fileName = `${directory}/${image}`;
        this.textureLoader.loadDetails(shadowContainer, fileName, (details) => {
            const { tileSet } = details;
            const properties = tileSet.properties || {};
            const size = (properties.size || 1) as number;
            const shadow = this.textureLoader.createAnimatedSprite('misc', 'shadow');
            shadow.scale.set(size, size);
            shadow.x = (1 - size) * tileSet.tilewidth / 2;
            shadow.y = (1 - size) * tileSet.tileheight / 2;
            shadow.blendMode = PIXI.BLEND_MODES.MULTIPLY;
            shadowContainer.addChild(shadow);

            if (typeof properties.animationSpeed === 'number') {
                this.fixAnimationSpeed = properties.animationSpeed;
                this.softUpdate();
            }
        });

        this.addChild(this.createAnimatedSprite(fileName, fileName, directory, palette || void 0));
    }

    protected calculateAnimationSpeed(): number {
        if (this.fixAnimationSpeed === null) {
            return super.calculateAnimationSpeed();
        }
        return this.fixAnimationSpeed;
    }
}