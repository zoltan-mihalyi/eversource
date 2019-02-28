import { Position } from '../../../common/domain/Location';
import { Entity } from '../../../common/es/Entity';
import { QuestId } from '../../../common/domain/InteractionTable';
import { QuestStatus } from '../character/CharacterDetails';
import { Quest } from '../quest/Quest';
import { CommonComponents, Xp } from '../../../common/components/CommonComponents';

export interface Moving {
    readonly x: number;
    readonly y: number;
    readonly running: boolean;
}

export interface AIMovingController {
    nextMoveTime: number;
    initial: Position;
    target: Position;

    running: boolean;
    interval: number;
    radiusX: number;
    radiusY: number;
}

interface Speed {
    readonly running: number;
    readonly walking: number;
}

interface Weapon {
    readonly damage: number;
}

interface SpawnedBy {
    readonly spawner: Entity<ServerComponents>;
}

export interface Spawner {
    readonly template: Partial<ServerComponents>;
    readonly spawnTime: number;
}

interface SpawnTimer {
    nextSpawnTime: number;
}

interface Area {
    name: string;
    width: number;
    height: number;
}

export interface Interactable {
    story: string;
    quests: Quest[];
    questCompletions: Quest[];
}

interface Interacting {
    entity: Entity<ServerComponents>;
}

export type QuestLog = Map<QuestId, QuestStatus>;

export interface Quests {
    questLog: QuestLog;
    questsDone: Set<QuestId>;
}

type DestroyAction = {
    type: 'destroy';
};

type SpellAction = {
    type: 'spell';
    spellId: string;
};

export type UseAction = DestroyAction | SpellAction;

export interface ServerComponents extends CommonComponents {
    xp: Xp;
    speed: Speed;
    moving: Moving;
    aiMovingController: AIMovingController;
    npcId: string;
    area: Area;
    quests: Quests;
    weapon: Weapon;
    spawner: Spawner;
    spawnedBy: SpawnedBy;
    spawnTimer: SpawnTimer;
    interactable: Interactable;
    interacting: Interacting;
    listening: true;
    useActions: UseAction[];
}
