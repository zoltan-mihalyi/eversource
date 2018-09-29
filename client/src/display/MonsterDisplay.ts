import { MonsterEntityData } from '../../../common/domain/MonsterEntityData';
import { CreatureDisplay } from './CreatureDisplay';

const DISPLAYED_PROPERTIES: (keyof MonsterEntityData)[] = [
    'image',
    'palette',
    'direction',
    'activity',
];

export class MonsterDisplay extends CreatureDisplay<MonsterEntityData> {
    protected displayedProperties = DISPLAYED_PROPERTIES;

    protected build() {
        super.build();

        const { image, palette } = this.data;

        const directory = `monster/${image}`;
        const fileName = `${directory}/${image}`;
        this.addChild(this.createAnimatedSprite(fileName, fileName, directory, palette || void 0));
    }
}