import { ClientState } from './ClientState';
import { Zone } from '../world/Zone';
import { CharacterSelectionRequestHandler } from './CharacterSelectionRequestHandler';
import { EntityData, EntityInteraction } from '../../../common/domain/EntityData';
import { PlayerState } from '../../../common/protocol/PlayerState';
import { QuestId } from '../../../common/domain/InteractionTable';
import { questInfoMap } from '../quest/QuestIndexer';
import { DynamicDiffable } from './diffable/DynamicDiffable';
import { DiffablePlayerState } from './diffable/DiffablePlayerState';
import { QuestLogItem } from '../../../common/protocol/QuestLogItem';
import { Entity, EntityId } from '../../../common/es/Entity';
import { Quests, ServerComponents } from '../es/ServerComponents';
import { getInteractionTable } from '../es/InteractionSystem';
import { BaseCreatureEntityData } from '../../../common/domain/CreatureEntityData';

export interface PlayerData {
    entity: Entity<ServerComponents>;
    zone: Zone;
}

export class PlayingRequestHandler extends ClientState<PlayerData> {
    private readonly worldDiff = new DynamicDiffable<EntityId, EntityData>();
    private readonly playerStateDiff = new DiffablePlayerState();
    private readonly questLogDiff = new DynamicDiffable<QuestId, QuestLogItem>();
    private detectionDistance = 15;

    leave() {
        this.cleanup();
        this.manager.enter(CharacterSelectionRequestHandler, void 0);
    }

    command(data: string) {
        const separatorIndex = data.indexOf(':');
        const command = separatorIndex === -1 ? data : data.substring(0, separatorIndex); // todo duplicate
        const params = separatorIndex === -1 ? '' : data.substring(separatorIndex + 1);

        const entity = this.data.entity;
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
                entity.set('moving', {
                    running: true,
                    x: sX,
                    y: sY,
                });
                break;
            }
            case 'interact': {
                const id = +params;
                if (isNaN(id)) {
                    return;
                }
                const targetEntity = this.data.zone.getEntity(id as EntityId);
                if (!targetEntity) {
                    return;
                }
                this.data.zone.eventBus.emit('tryInteract', {
                    source: entity,
                    target: targetEntity,
                });
                break;
            }
            case 'interact-end': {
                entity.unset('interacting');
                break;
            }
            case 'accept-quest': {
                const questId = +params as QuestId;
                if (isNaN(questId)) {
                    return;
                }

                this.data.zone.eventBus.emit('tryAcceptQuest', { entity, questId });
                break;
            }
            case 'complete-quest': {
                const questId = +params as QuestId;
                if (isNaN(questId)) {
                    return;
                }

                this.data.zone.eventBus.emit('tryCompleteQuest', { entity, questId });
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
        const { zone, entity } = this.data;

        this.context.networkLoop.remove(this.networkUpdate);
        zone.removeEntity(entity);
    }

    private indexEntities(entities: Entity<ServerComponents>[]): Map<EntityId, EntityData> {
        const result = new Map<EntityId, EntityData>();
        for (const entity of entities) {
            result.set(entity.id, getFor(this.data.entity, entity));
        }
        return result;
    }

    private sendPlayerData() {
        const { entity } = this.data;

        const { interacting } = entity.components;

        const playerState: PlayerState = {
            interaction: !interacting ? null : getInteractionTable(interacting.entity, entity.components.quests!), // TODO
            character: {
                xp: entity.components.xp!.value,
                level: entity.components.level!.value,
                id: entity.id,
            },
        };

        const diffs = this.playerStateDiff.update(playerState);

        if (diffs !== null) {
            this.context.sendCommand('playerState', diffs);
        }
    }

    private sendQuestLog() {
        const questLog = this.data.entity.components.quests!.questLog;

        const qLogByQ = new Map<QuestId, QuestLogItem>();

        questLog.forEach((status, id) => qLogByQ.set(id, { info: questInfoMap.get(id)!, status }));

        const diffs = this.questLogDiff.update(qLogByQ);

        if (diffs !== null) {
            this.context.sendCommand('questLog', diffs);
        }
    }

    private sendWorldData() {
        const { entity, zone } = this.data;

        const distance = this.detectionDistance;
        const { x, y } = entity.components.position!; // TODO
        const entities = zone.query(x - distance, y - distance, x + distance, y + distance)
            .filter(e => e.components.view); // TODO
        const entityMap = this.indexEntities(entities);

        const diffs = this.worldDiff.update(entityMap);

        if (diffs !== null) {
            this.context.sendCommand('world', diffs);
        }
    }

    private networkUpdate = () => {
        this.sendPlayerData();
        this.sendQuestLog();
        this.sendWorldData();
    };
}

function validNumber(num: number): boolean {
    return !isNaN(num) && isFinite(num);
}

function getFor(viewer: Entity<ServerComponents>, entity: Entity<ServerComponents>): EntityData {
    const { position, level, hp, view, attitude, name, scale, effects, player } = entity.components;

    if (!view) {
        throw new Error('view');
    }

    const base: BaseCreatureEntityData = {
        name: name!.value,
        level: level!.value,
        hp: hp!.current,
        maxHp: hp!.max,
        player: !!player,
        direction: view.direction,
        activity: view.activity.type,
        activitySpeed: view.activity.type === 'standing' ? 0 : view.activity.speed,
        attitude: attitude!.value,
        position: position!,
        interaction: getInteraction(entity, viewer.components.quests!),
        scale: scale!.value,
        effects: effects || [], //TODO
    };

    switch (view.type) {
        case 'simple': {
            return {
                ...base,
                type: 'monster',
                image: view.image,
                palette: view.palette,
            }
        }
        case 'humanoid': {
            return {
                ...base,
                type: 'humanoid',
                appearance: view.appearance,
                equipment: view.equipment,
            }
        }
    }

    throw new Error('unknown view: ' + view);
}

function getInteraction(entity: Entity<ServerComponents>, quests: Quests): [EntityInteraction] | null {
    const interactionTable = getInteractionTable(entity, quests);
    if (interactionTable === null) {
        return null;
    }

    const interactions: EntityInteraction[] = [];

    const { completable, completableLater, acceptable } = interactionTable;
    if (acceptable.length !== 0) {
        interactions.push('quest');
    }
    if (completable.length !== 0) {
        interactions.push('quest-complete');
    }
    if (completableLater.length !== 0) {
        interactions.push('quest-complete-later');
    }

    if (interactions.length === 0) {
        return null;
    }
    return interactions as [EntityInteraction];
}
