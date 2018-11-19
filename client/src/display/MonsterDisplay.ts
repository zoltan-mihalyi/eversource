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

    protected buildShadow() {
        const shadowContainer = new PIXI.Container();
        this.shadowContainer.addChild(shadowContainer);
        const { textureLoader } = this.context;
        textureLoader.loadDetails(shadowContainer, this.getDirectoryAndFileName()[1], (details) => {
            const { tileSet } = details;
            const properties = tileSet.properties || {};
            const size = (properties.size || 1) as number;
            const shadow = textureLoader.createAnimatedSprite('misc', 'shadow');
            shadow.scale.set(size, size);
            shadow.blendMode = PIXI.BLEND_MODES.MULTIPLY;
            shadowContainer.addChild(shadow);

            if (typeof properties.animationSpeed === 'number') {
                this.fixAnimationSpeed = properties.animationSpeed;
                this.softUpdate();
            }
        });
    }

    protected buildSprite() {

        const { palette } = this.data;

        const [directory, fileName] = this.getDirectoryAndFileName();

        this.spriteContainer.addChild(this.createAnimatedSprite(fileName, fileName, directory, palette || void 0));
    }

    protected calculateAnimationSpeed(): number {
        if (this.fixAnimationSpeed === null) {
            return super.calculateAnimationSpeed();
        }
        return this.fixAnimationSpeed;
    }

    private getDirectoryAndFileName(): [string, string] {
        const { image } = this.data;
        const directory = `monster/${image}`;
        const fileName = `${directory}/${image}`;
        return [directory, fileName]
    }
}