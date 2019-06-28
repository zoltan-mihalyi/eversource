import { objectEdit, PropertyConfig } from '../components/edit/ObjectEdit';
import { MonsterPreset, MonsterTemplate } from '../../../server/src/world/Presets';
import { optionalEdit } from '../components/edit/OptionalEdit';
import { CreatureSoundDescriptor } from '../../../server/src/es/ServerComponents';
import { TextEdit } from '../components/edit/TextEdit';
import { NumberEdit } from '../components/edit/NumberEdit';
import { arrayEdit } from '../components/edit/ArrayEdit';
import { MonsterTemplateIdEdit } from '../presets/common/IdEdits';

export const EMPTY_SOUND_DESCRIPTOR: CreatureSoundDescriptor = {
    directory: 'monster',
    aggro: 0,
    attack: 0,
    idle: 0,
    die: 0
};


const baseConfig: PropertyConfig<Pick<MonsterTemplate, 'sound'>> = {
    sound: {
        component: optionalEdit<CreatureSoundDescriptor, undefined>(EMPTY_SOUND_DESCRIPTOR, objectEdit<CreatureSoundDescriptor>({
            directory: { component: TextEdit },
            aggro: { component: NumberEdit },
            attack: { component: NumberEdit },
            die: { component: NumberEdit },
            idle: { component: NumberEdit },
        }), void 0)
    },
};

export const MonsterExtraPropsEdit = objectEdit<Pick<MonsterPreset, 'sound' | 'templates'>>({
    ...baseConfig,
    templates: { component: optionalEdit<string[], undefined>([], arrayEdit<string>('sound_bee', MonsterTemplateIdEdit), void 0) }
});
export const MonsterTemplateEditWithName = objectEdit<MonsterTemplate>({
    name: { component: TextEdit },
    ...baseConfig
});