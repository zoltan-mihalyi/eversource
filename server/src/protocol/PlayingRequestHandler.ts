import { ClientState } from './ClientState';
import { Zone } from '../world/Zone';
import { CharacterSelectionRequestHandler } from './CharacterSelectionRequestHandler';
import { PlayerState } from '../../../common/protocol/PlayerState';
import { QuestId } from '../../../common/domain/InteractionTable';
import { DynamicDiffable, mapDiffs } from './diffable/DynamicDiffable';
import { DiffablePlayerState } from './diffable/DiffablePlayerState';
import { QuestLogItem } from '../../../common/protocol/QuestLogItem';
import { Entity, EntityId } from '../../../common/es/Entity';
import { ServerComponents } from '../es/ServerComponents';
import { getInteractionTable, questRequirementsProgression } from '../es/InteractionSystem';
import {
    NetworkComponents,
    PossibleInteraction,
    PossibleInteractions,
} from '../../../common/components/NetworkComponents';
import { Nullable } from '../../../common/util/Types';
import { getDirection } from '../../../common/game/direction';
import { Direction } from '../../../common/components/CommonComponents';
import { CharacterInfo } from '../../../common/domain/CharacterInfo';
import { CHAT_MESSAGE_MAXIMUM_LENGTH } from '../../../common/constants';
import { QuestIndexer } from '../quest/QuestIndexer';
import { InventoryItemInfo, SlotId } from '../../../common/protocol/Inventory';
import { InventoryItem, itemInfo } from '../Item';

export interface PlayerData {
    entity: Entity<ServerComponents>;
    characterInfo: CharacterInfo;
    zone: Zone;
}

export class PlayingRequestHandler extends ClientState<PlayerData> {
    private readonly worldDiff = new DynamicDiffable<EntityId, Nullable<NetworkComponents>>();
    private readonly playerStateDiff = new DiffablePlayerState();
    private readonly questLogDiff = new DynamicDiffable<QuestId, QuestLogItem>();
    private readonly inventoryDiff = new DynamicDiffable<SlotId, InventoryItem>();
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
            case 'abandon-quest': {
                const questId = +params as QuestId;
                if (isNaN(questId)) {
                    return;
                }

                this.data.zone.eventBus.emit('tryAbandonQuest', { entity, questId });
                break;
            }
            case 'chat-message': {
                if (params.trim() === '') {
                    break;
                }
                this.data.zone.eventBus.emit('chatMessage', {
                    sender: entity,
                    text: params.substring(0, CHAT_MESSAGE_MAXIMUM_LENGTH),
                });
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

    private indexEntities(entities: Entity<ServerComponents>[]): Map<EntityId, Nullable<NetworkComponents>> {
        const result = new Map<EntityId, Nullable<NetworkComponents>>();
        for (const entity of entities) {
            result.set(entity.id, this.getFor(entity));
        }
        return result;
    }

    private sendPlayerData() {
        const { entity, characterInfo } = this.data;

        const { interacting } = entity.components;

        const questIndexer = this.context.world.dataContainer.questIndexer;
        const playerState: PlayerState = {
            interaction: !interacting ? null : getInteractionTable(entity, interacting.entity, questIndexer),
            character: {
                sex: characterInfo.sex,
                name: characterInfo.name,
                classId: characterInfo.classId,
                xp: entity.components.xp!.value,
                level: entity.components.level!.value,
                inventorySize: 32,
            },
        };

        const diffs = this.playerStateDiff.update(playerState);

        if (diffs !== null) {
            this.context.sendCommand('playerState', diffs);
        }
    }

    private sendQuestLog() {
        const { questInfoMap, quests } = this.context.world.dataContainer.questIndexer;
        const { quests: playerQuests, inventory } = this.data.entity.components;
        const questLog = playerQuests!.questLog;

        const qLogByQ = new Map<QuestId, QuestLogItem>();

        questLog.forEach((taskStatus, id) => {
            const status = taskStatus === 'failed' ? taskStatus : [
                ...taskStatus,
                ...questRequirementsProgression(quests.get(id)!, inventory!),
            ];

            qLogByQ.set(id, { info: questInfoMap.get(id)!, status });
        });

        const diffs = this.questLogDiff.update(qLogByQ);

        if (diffs !== null) {
            this.context.sendCommand('questLog', diffs);
        }
    }

    private sendInventory() {
        const diffs = this.inventoryDiff.update(this.data.entity.components.inventory!.getMap());
        const items = this.context.world.dataContainer.items;

        if (diffs !== null) {
            this.context.sendCommand('inventory', mapDiffs(diffs, (data, slotId) => {
                const { count, itemId } = data;

                const result: Partial<InventoryItemInfo> = {
                    count,
                    slotId,
                };

                if (itemId) {
                    Object.assign(result, itemInfo(items, itemId));
                }

                return result;
            }));
        }
    }

    private sendWorldData() {
        const { entity, zone } = this.data;

        const distance = this.detectionDistance;
        const { x, y } = entity.components.position!; // TODO
        const entities = zone.query(x - distance, y - distance, x + distance, y + distance);
        const entityMap = this.indexEntities(entities);

        const diffs = this.worldDiff.update(entityMap);

        if (diffs !== null) {
            this.context.sendCommand('world', diffs);
        }
    }

    private getFor(entity: Entity<ServerComponents>): Nullable<NetworkComponents> {
        const viewer = this.data.entity;

        return {
            ...pickOrNull(entity.components, [
                'position',
                'level',
                'hp',
                'view',
                'direction',
                'animation',
                'activity',
                'attitude',
                'name',
                'scale',
                'effects',
                'player',
            ]),
            direction: getFacingDirection(viewer, entity),
            playerControllable: viewer === entity ? true : null,
            possibleInteractions: getPossibleInteractions(viewer, entity, this.context.world.dataContainer.questIndexer) || null, // TODO
        };
    }

    private networkUpdate = () => {
        this.sendPlayerData();
        this.sendQuestLog();
        this.sendInventory();
        this.sendWorldData();
    };
}

function validNumber(num: number): boolean {
    return !isNaN(num) && isFinite(num);
}


function getFacingDirection(viewer: Entity<ServerComponents>, entity: Entity<ServerComponents>): Direction | null {
    let direction = entity.components.direction || null;

    const { interacting, position } = viewer.components;
    if (position && interacting && interacting.entity === entity && entity.components.position) {
        const entityPosition = entity.components.position;
        direction = getDirection(position.x - entityPosition.x, position.y - entityPosition.y) || direction;
    }

    return direction;
}

function getPossibleInteractions(source: Entity<ServerComponents>, target: Entity<ServerComponents>,
                                 questIndexer: QuestIndexer): PossibleInteractions | null {

    const interactionTable = getInteractionTable(source, target, questIndexer);
    if (interactionTable === null) {
        return null;
    }

    const interactions: PossibleInteraction[] = [];

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
        return ['story'];
    }
    return interactions;
}

function pickOrNull<T, K extends keyof T>(obj: T, keys: K[]): Nullable<Required<Pick<T, K>>> {
    const result = {} as Nullable<Required<Pick<T, K>>>;

    for (const key of keys) {
        result[key] = obj[key] === void 0 ? null : obj[key];
    }

    return result;
}
