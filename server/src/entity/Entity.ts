import { Grid, GridBlock } from '../../../common/Grid';
import { Position, X, Y } from '../../../common/domain/Location';
import { EntityData, EntityId, EntityInteraction, EntityInteractions } from '../../../common/domain/EntityData';
import { CharacterDetails, QuestStatus } from '../character/CharacterDetails';
import { Quest } from '../quest/Quest';
import { InteractionTable, QuestId, QuestInfo } from '../../../common/domain/InteractionTable';
import { questInfoMap } from '../quest/QuestIndexer';

let nextId = 0;

export interface HiddenPlayerInfo {
    state: HiddenPlayerState;
    details: CharacterDetails;
}

export interface HiddenPlayerState {
    interacting?: Entity;
    questLog: Map<QuestId, QuestStatus>;
}

export interface HiddenEntityData {
    quests: Quest[];
    questCompletions: Quest[];
    player?: HiddenPlayerInfo;
}

const EMPTY_HIDDEN_ENTITY_DATA: HiddenEntityData = {
    quests: [],
    questCompletions: [],
};

export abstract class Entity<O extends EntityData = EntityData> {
    readonly id = nextId++ as EntityId;

    protected constructor(protected state: Readonly<O>, protected hidden: HiddenEntityData = EMPTY_HIDDEN_ENTITY_DATA) {
    }

    protected set<K extends keyof O>(partial: Pick<O, K>) {
        this.state = {
            ...this.state as any,
            ...partial as any,
        };
    }

    setSingle<K extends keyof O>(key: K, value: O[K]) {
        if (value !== this.state[key]) {
            this.state = {
                ...this.state as any,
                [key]: value,
            }
        }
    }

    get(): O {
        return this.state;
    }

    getInteractionsFor(details: CharacterDetails): InteractionTable {
        const acceptable: QuestInfo[] = [];
        const completable: QuestInfo[] = [];

        const { questsDone, questLog } = details;
        for (const quest of this.hidden.quests) {
            const isNewQuest = !questsDone.has(quest.id) && !questLog.has(quest.id);
            if (isNewQuest && canAcceptQuest(questsDone, quest)) {
                acceptable.push(questInfoMap.get(quest.id)!);
            }
        }

        for (const quest of this.hidden.questCompletions) {
            const questStatus = questLog.get(quest.id);
            if (questStatus !== void 0 && questStatus !== 'failed' && allTaskComplete(quest, questStatus)) {
                completable.push(questInfoMap.get(quest.id)!);
            }
        }

        return { entityId: this.id, acceptable, completable }
    }

    getFor(details: CharacterDetails): EntityData {
        const entityData = this.get();

        const { completable, acceptable } = this.getInteractionsFor(details);

        const interactions: EntityInteraction[] = [];
        if (acceptable.length !== 0) {
            interactions.push('quest');
        }
        if (completable.length !== 0) {
            interactions.push('quest-complete');
        }

        if (interactions.length !== 0) {
            return {
                ...entityData as any,
                interaction: extendInteraction(entityData.interaction, interactions as EntityInteractions),
            };
        }

        return entityData;
    }

    update(grid: Grid, delta: number) {
    }

    emit(eventType: string, payload?: any) {
    }

    tryMove(grid: Grid, dx: number, dy: number) {
        const { x, y } = this.state.position;

        let newX = x + dx;
        let newY = y + dy;

        if (dx !== 0) {
            const dir = Math.sign(dx);
            const side = dir === 1 ? 1 : 0;

            for (let i = Math.floor(x); i * dir <= Math.floor(newX) * dir; i += dir) {
                const edge1 = getHorizontalEdge(grid.getBlock(i + side, Math.floor(y)), 1 - side, y % 1);
                const edge2 = getHorizontalEdge(grid.getBlock(i + side, Math.floor(y)), 1 - side, 1);
                const edge3 = getHorizontalEdge(grid.getBlock(i + side, Math.ceil(y)), 1 - side, y % 1);
                const closestEdge = Math.min(edge1 * dir, edge2 * dir, edge3 * dir) * dir;
                if ((newX * dir) > (i + closestEdge) * dir) {
                    newX = (i + closestEdge);
                    break;
                }
            }
        }
        if (dy !== 0) {
            const dir = Math.sign(dy);
            const side = dir === 1 ? 1 : 0;

            for (let i = Math.floor(y); i * dir <= Math.floor(newY) * dir; i += dir) {
                const edge1 = getVerticalEdge(grid.getBlock(Math.floor(newX), i + side), 1 - side, newX % 1);
                const edge2 = getVerticalEdge(grid.getBlock(Math.floor(newX), i + side), 1 - side, 1);
                const edge3 = getVerticalEdge(grid.getBlock(Math.ceil(newX), i + side), 1 - side, newX % 1);
                const closestEdge = Math.min(edge1 * dir, edge2 * dir, edge3 * dir) * dir;
                if ((newY * dir) > (i + closestEdge) * dir) {
                    newY = (i + closestEdge);
                    break;
                }
            }
        }

        if (newX !== x || newY !== y) {
            this.set({
                position: { x: newX as X, y: newY as Y } as Position,
            });
        }
    }
}

function canAcceptQuest(done: Set<QuestId>, quest: Quest) { // TODO refactor this
    for (const requirement of quest.requires) {
        if (!done.has(requirement)) {
            return false;
        }
    }
    return true;
}

function extendInteraction(base: EntityInteractions | null, extra: EntityInteractions): EntityInteractions {
    return Array.from(new Set([...base || [], ...extra])) as EntityInteractions;
}

function getHorizontalEdge(block: GridBlock, side: number, y: number) {
    switch (block) {
        case GridBlock.EMPTY:
            return side === 0 ? Infinity : -Infinity;
        case GridBlock.TOP_LEFT:
            return side === 0 ? 0 : 1 - y;
        case GridBlock.TOP_RIGHT:
            return side === 1 ? 1 : y;
        case GridBlock.BOTTOM_LEFT:
            return side === 0 ? 0 : y;
        case GridBlock.BOTTOM_RIGHT:
            return side === 1 ? 1 : 1 - y;
        default:
            return side;
    }
}

function getVerticalEdge(block: GridBlock, side: number, x: number) {
    switch (block) {
        case GridBlock.EMPTY:
            return side === 0 ? Infinity : -Infinity;
        case GridBlock.TOP_LEFT:
            return side === 0 ? 0 : 1 - x;
        case GridBlock.TOP_RIGHT:
            return side === 0 ? 0 : x;
        case GridBlock.BOTTOM_LEFT:
            return side === 1 ? 1 : x;
        case GridBlock.BOTTOM_RIGHT:
            return side === 1 ? 1 : 1 - x;
        default:
            return side;
    }
}

function allTaskComplete(quest: Quest, questStatus: QuestStatus): boolean {
    for (let i = 0; i < quest.tasks.length; i++) {
        if (questStatus[i] !== quest.tasks[i].count) {
            return false;
        }
    }
    return true;
}