import { HumanoidPresets, MonsterPresets, ObjectPresets } from '../world/Presets';
import { Spells } from '../Spell';
import { Items } from '../Item';
import { QuestIndexer } from '../quest/QuestIndexer';
import * as fs from "fs";

export interface DataContainer {
    humanoid: HumanoidPresets;
    monster: MonsterPresets;
    object: ObjectPresets;

    spells: Spells;
    items: Items;
    questIndexer: QuestIndexer;
}

export function createDataContainerFromFiles(dataDir: string): DataContainer {

    function readJson(fileName: string) {
        return JSON.parse(fs.readFileSync(`${dataDir}/${fileName}.json`, 'utf-8'));
    }

    const items = readJson('items');

    return {
        humanoid: readJson('presets/humanoids'),
        monster: readJson('presets/monsters'),
        object: readJson('presets/objects'),
        spells: extendWithId(readJson('spells')),
        items,
        questIndexer: new QuestIndexer(readJson('quests'), items),
    }
}

type WithIdMap<T> = { [id: string]: T & { id: string } };

function extendWithId<T>(map: { [id: string]: T }): WithIdMap<T> {
    const result: WithIdMap<T> = {};

    for (const key of Object.keys(map)) {
        result[key] = {
            id: key,
            ...map[key] as any
        };
    }

    return result;
}
