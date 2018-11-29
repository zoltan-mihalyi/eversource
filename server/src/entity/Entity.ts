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
        const completableLater: QuestInfo[] = [];

        const { questsDone, questLog } = details;
        for (const quest of this.hidden.quests) {
            const isNewQuest = !questsDone.has(quest.id) && !questLog.has(quest.id);
            if (isNewQuest && canAcceptQuest(questsDone, quest)) {
                acceptable.push(questInfoMap.get(quest.id)!);
            }
        }

        for (const quest of this.hidden.questCompletions) {
            const questStatus = questLog.get(quest.id);
            if (questStatus === void 0) {
                continue;
            }
            const questInfo = questInfoMap.get(quest.id)!;
            if (questStatus !== 'failed' && allTaskComplete(quest, questStatus)) {
                completable.push(questInfo);
            } else {
                completableLater.push(questInfo);
            }
        }

        return {
            name: this.state.name,
            entityId: this.id,
            acceptable,
            completable,
            completableLater,
        };
    }

    getFor(details: CharacterDetails): EntityData {
        const entityData = this.get();

        const { completable, completableLater, acceptable } = this.getInteractionsFor(details);

        const interactions: EntityInteraction[] = [];
        if (acceptable.length !== 0) {
            interactions.push('quest');
        }
        if (completable.length !== 0) {
            interactions.push('quest-complete');
        }
        if (completableLater.length !== 0) {
            interactions.push('quest-complete-later');
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

        const halfSize = this.getSize() / 2;

        if (dx !== 0) {
            const dir = Math.sign(dx);
            const goingRight = dir > 0;
            const side = halfSize * dir;

            const top = y - halfSize;
            const bottom = y + halfSize - 1;

            for (let i = Math.floor(x + side); i * dir <= Math.floor(newX + side) * dir; i += dir) {
                const edges = [
                    getHorizontalEdge(grid.getBlock(i, Math.floor(top)), goingRight, top % 1),
                    getHorizontalEdge(grid.getBlock(i, Math.ceil(bottom)), goingRight, (bottom % 1) || 1),
                ];

                for (let j = Math.floor(top); j < Math.ceil(bottom); j += 1) {
                    edges.push(getHorizontalEdge(grid.getBlock(i, j), goingRight, 1));
                }

                const closestEdge = dir === -1 ? Math.max(...edges) : Math.min(...edges);
                const closestX = i + closestEdge - side;
                if (newX * dir > closestX * dir) {
                    newX = closestX;
                    break;
                }
            }
        }
        if (dy !== 0) {
            const dir = Math.sign(dy);
            const goingDown = dir > 0;
            const side = halfSize * dir;

            const left = newX - halfSize;
            const right = newX + halfSize- 1;

            for (let j = Math.floor(y + side); j * dir <= Math.floor(newY + side) * dir; j += dir) {
                const edges = [
                    getVerticalEdge(grid.getBlock(Math.floor(left), j), goingDown, left % 1),
                    getVerticalEdge(grid.getBlock(Math.ceil(right), j), goingDown, (right % 1) || 1),
                ];

                for (let i = Math.floor(left); i < Math.ceil(right); i += 1) {
                    edges.push(getHorizontalEdge(grid.getBlock(i, j), goingDown, 1));
                }

                const closestEdge = dir === -1 ? Math.max(...edges) : Math.min(...edges);
                const closestY = j + closestEdge - side;
                if (newY * dir > closestY * dir) {
                    newY = closestY;
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

    protected abstract getSize(): number;
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

function getHorizontalEdge(block: GridBlock, goingRight: boolean, y: number) {
    switch (block) {
        case GridBlock.EMPTY:
            return goingRight ? Infinity : -Infinity;
        case GridBlock.TOP_LEFT:
            return goingRight ? 0 : 1 - y;
        case GridBlock.TOP_RIGHT:
            return goingRight ? y : 1;
        case GridBlock.BOTTOM_LEFT:
            return goingRight ? 0 : y;
        case GridBlock.BOTTOM_RIGHT:
            return goingRight ? 1 - y : 1;
        default:
            return goingRight ? 0 : 1;
    }
}

function getVerticalEdge(block: GridBlock, goingDown: boolean, x: number) {
    switch (block) {
        case GridBlock.EMPTY:
            return goingDown ? Infinity : -Infinity;
        case GridBlock.TOP_LEFT:
            return goingDown ? 0 : 1 - x;
        case GridBlock.TOP_RIGHT:
            return goingDown ? 0 : x;
        case GridBlock.BOTTOM_LEFT:
            return goingDown ? x : 1;
        case GridBlock.BOTTOM_RIGHT:
            return goingDown ? 1 - x : 1;
        default:
            return goingDown ? 0 : 1;
    }
}

function allTaskComplete(quest: Quest, questStatus: QuestStatus): boolean {
    const tasks = quest.tasks;
    if (!tasks) {
        return true;
    }

    for (let i = 0; i < tasks.list.length; i++) {
        if (questStatus[i] !== tasks.list[i].count) {
            return false;
        }
    }
    return true;
}