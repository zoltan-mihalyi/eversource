import { ClientState } from './ClientState';
import { Zone } from '../world/Zone';
import { CharacterSelectionRequestHandler } from './CharacterSelectionRequestHandler';
import { Diff } from '../../../common/protocol/Diff';
import { Entity, HiddenEntityData, HiddenPlayerInfo } from '../entity/Entity';
import { CreatureEntity } from '../entity/CreatureEntity';
import { EntityData, EntityId } from '../../../common/domain/EntityData';
import { PlayerController } from '../entity/controller/PlayerController';
import { canInteract } from '../../../common/game/Interaction';
import { PlayerState } from '../../../common/protocol/PlayerState';
import { QuestId, QuestInfo } from '../../../common/domain/InteractionTable';

export interface PlayerData {
    zone: Zone;
    character: CreatureEntity;
    controller: PlayerController;
    hidden: HiddenEntityData;
}

export class PlayingRequestHandler extends ClientState<PlayerData> {
    private lastSent = new Map<Entity, EntityData>();
    private lastSentPlayerData: PlayerState = { interaction: null }; // TODO encapsulate with diff sending logic
    private detectionDistance = 15;

    leave() {
        this.cleanup();
        this.manager.enter(CharacterSelectionRequestHandler, void 0);
    }

    command(data: string) {
        const separatorIndex = data.indexOf(':');
        const command = separatorIndex === -1 ? data : data.substring(0, separatorIndex); // todo duplicate
        const params = separatorIndex === -1 ? '' : data.substring(separatorIndex + 1);

        const player = this.data.hidden.player!;
        switch (command) {
            case 'move': {
                const split = params.split(',');
                if (split.length !== 2) {
                    return;
                }
                const sX = parseFloat(split[0]);
                const sY = parseFloat(split[1]);
                if (!validNumber(sX) || !validNumber(sY)) {
                    return;
                }
                this.data.controller.move(sX, sY);
                break;
            }
            case 'interact': {
                const id = +params;
                if (isNaN(id)) {
                    return;
                }
                const entity = this.data.zone.getEntity(id as EntityId);
                if (!entity) {
                    return;
                }
                const entityData = entity.getFor(player.details);
                if (!canInteract(this.data.character.get(), entityData)) {
                    return;
                }
                player.state.interacting = entity;
                break;
            }
            case 'interact-end': {
                player.state.interacting = void 0;
                break;
            }
            case 'accept-quest': {
                const quest = findQuest(player,params, 'acceptable');
                if (!quest) {
                    return;
                }
                player.details.quests.set(quest.id, []);
                break;
            }
            case 'complete-quest': {
                const quest = findQuest(player, params, 'completable');
                if (!quest) {
                    return;
                }
                player.details.quests.set(quest.id, 'done');
                break;
            }
        }
    }

    onEnter() {
        this.context.networkLoop.add(this.networkUpdate);
    }

    handleExit() {
        this.cleanup();
    }

    private cleanup() {
        const { zone, character } = this.data;

        this.context.networkLoop.remove(this.networkUpdate);
        zone.removeEntity(character);
    }

    private indexEntities(entities: Entity[]): Map<Entity, EntityData> {
        const result = new Map<Entity, EntityData>();
        for (const entity of entities) {
            result.set(entity, entity.getFor(this.data.hidden.player!.details));
        }
        return result;
    }

    private sendPlayerData() {
        const { state, details } = this.data.hidden.player!;

        let { interacting } = state;
        const playerState: PlayerState = {
            interaction: !interacting ? null : interacting.getInteractionsFor(details),
        };

        const lastSent = this.lastSentPlayerData;
        const changes: Partial<PlayerState> = {};
        let changed = false;
        for (const key of Object.keys(playerState) as (keyof PlayerState)[]) {
            if (!equals(lastSent, playerState, key)) {
                changed = true;
                changes[key] = playerState[key];
            }
        }
        if (changed) {
            this.lastSentPlayerData = playerState;
            this.context.sendCommand('playerState', changes);
        }
    }

    private sendWorldData() {
        const { character, zone } = this.data;

        const distance = this.detectionDistance;
        const { x, y } = character.get().position;
        const entities = zone.query(x - distance, y - distance, x + distance, y + distance);
        const entityMap = this.indexEntities(entities);

        const lastSent = this.lastSent;

        const diffs: Diff[] = [];

        entityMap.forEach((object, entity) => {
            const previousObject = lastSent.get(entity);
            if (!previousObject) {
                diffs.push(this.createDiff(entity, object));
            } else {
                let hasDiff = false;
                const changes: Partial<EntityData> = {};
                for (const key of Object.keys(object) as (keyof EntityData)[]) {
                    if (!equals(previousObject, object, key)) {
                        hasDiff = true;
                        changes[key] = object[key];
                    }
                }
                if (hasDiff) {
                    diffs.push({ type: 'change', id: entity.id, changes });
                }
            }
        });

        lastSent.forEach((object, entity) => {
            if (!entityMap.has(entity)) {
                diffs.push({ type: 'remove', id: entity.id });
            }
        });

        if (diffs.length !== 0) {
            this.context.sendCommand('diffs', diffs);
        }

        this.lastSent = entityMap;
    }

    private networkUpdate = () => {
        this.sendPlayerData();
        this.sendWorldData();
    };

    private createDiff(entity: Entity, data: EntityData): Diff {
        return {
            id: entity.id,
            type: 'create',
            self: entity === this.data.character,
            data,
        };
    }
}

function validNumber(num: number): boolean {
    return !isNaN(num) && isFinite(num);
}

function equals<T>(previousObject: T, currentObject: T, key: keyof T): boolean {
    const previous = previousObject[key];
    const current = currentObject[key];

    if (previous === current) {
        return true;
    }

    if (Array.isArray(previous) && Array.isArray(current)) {
        if (previous.length !== current.length) {
            return false;
        }
        for (let i = 0; i < previous.length; i++) {
            if (previous[i] !== current[i]) {
                return false;
            }
        }
        return true;
    }

    return false;
}

function findQuest(player: HiddenPlayerInfo, params: string, type: 'acceptable' | 'completable'): QuestInfo | undefined {
    const questId = +params as QuestId;
    if (isNaN(questId)) {
        return;
    }
    const entity = player.state.interacting;
    if (!entity) {
        return;
    }
    const interactionTable = entity.getInteractionsFor(player.details);
    return interactionTable[type].find(q => q.id === questId);
}
