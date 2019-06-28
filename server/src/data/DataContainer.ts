import { HumanoidPresets, MonsterPreset, MonsterPresets, MonsterTemplates, ObjectPresets } from '../world/Presets';
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
        monster: resolveTemplates(readJson('presets/monsters'), readJson('templates/monster-templates')),
        object: readJson('presets/objects'),
        spells: extendWithId(readJson('spells')),
        items,
        questIndexer: new QuestIndexer(readJson('quests'), items),
    }
}

function resolveTemplates(monsters: MonsterPresets, monsterTemplates: MonsterTemplates) {
    const resolvedMonsters: MonsterPresets = {};

    for (const monsterId of Object.keys(monsters)) {
        resolvedMonsters[monsterId] = resolveTemplate(monsters[monsterId], monsterTemplates);
    }

    return resolvedMonsters;
}

function resolveTemplate(monster: MonsterPreset, monsterTemplates: MonsterTemplates) {
    const templates = monster.templates;
    if (!templates) {
        return monster;
    }

    const resolvedPreset = {} as MonsterPreset;
    for (const templateId of templates) {
        const template = monsterTemplates[templateId];
        Object.assign(resolvedPreset, template);
    }
    Object.assign(resolvedPreset, monster);
    return resolvedPreset;
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
