import * as fs from 'fs';
import { idEdit, Labeled } from '../../components/edit/IdEdit';
import { Named } from '../../Utils';
import { ItemId } from '../../../../common/protocol/ItemInfo';
import { QuestId } from '../../../../common/domain/InteractionTable';


function createGetValues<T>(file: string, convertKey: (key: string) => T): () => Labeled<T>[] {
    return () => {
        const items = JSON.parse(fs.readFileSync(`../server/data/${file}.json`, 'utf-8')) as { [key: string]: Named };
        return Object.keys(items).map((key) => ({
            value: convertKey(key),
            label: items[key].name,
        }));
    };
}

export const ItemIdEdit = idEdit(createGetValues('items', key => +key as ItemId));
export const QuestIdEdit = idEdit(createGetValues('quests', key => +key as QuestId));
export const SpellIdEdit = idEdit(createGetValues('spells', key => key));
export const MonsterTemplateIdEdit = idEdit(createGetValues('templates/monster-templates', key => key));