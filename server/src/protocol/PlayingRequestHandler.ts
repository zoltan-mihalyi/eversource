import { ClientState } from './ClientState';
import { Zone } from '../world/Zone';
import { CharacterSelectionRequestHandler } from './CharacterSelectionRequestHandler';
import { Entity } from '../entity/Entity';
import { CreatureEntity } from '../entity/CreatureEntity';
import { EntityData, EntityId } from '../../../common/domain/EntityData';
import { PlayerController } from '../entity/controller/PlayerController';
import { canInteract } from '../../../common/game/Interaction';
import { PlayerState } from '../../../common/protocol/PlayerState';
import { QuestId } from '../../../common/domain/InteractionTable';
import { questInfoMap, questsById } from '../quest/QuestIndexer';
import { DynamicDiffable } from './diffable/DynamicDiffable';
import { DiffablePlayerState } from './diffable/DiffablePlayerState';
import { QuestLogItem } from '../../../common/protocol/QuestLogItem';
import { CreatureAttitude, CreatureEntityData } from '../../../common/domain/CreatureEntityData';
import { PlayerEntityOwner } from '../entity/EntityOwner';

export interface PlayerData {
    zone: Zone;
    character: CreatureEntity;
    controller: PlayerController;
    owner: PlayerEntityOwner;
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

        const owner = this.data.owner;
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
                const entityData = entity.getFor(owner.details);

                if (entity instanceof CreatureEntity && (entityData as CreatureEntityData).attitude !== CreatureAttitude.FRIENDLY) {
                    entity.hit(this.data.character);
                    return;
                }

                if (!canInteract(this.data.character.get(), entityData)) {
                    return;
                }
                owner.interacting = entity;
                break;
            }
            case 'interact-end': {
                owner.interacting = void 0;
                break;
            }
            case 'accept-quest': {
                const quest = owner.findQuest(params, 'acceptable');
                if (!quest) {
                    return;
                }
                const tasks = questsById[quest.id]!.tasks;
                const progression = tasks ? tasks.list.map(() => 0) : [];
                owner.details.questLog.set(quest.id, progression);
                break;
            }
            case 'complete-quest': {
                const quest = owner.findQuest(params, 'completable');
                if (!quest) {
                    return;
                }
                owner.details.questLog.delete(quest.id);
                owner.details.questsDone.add(quest.id);
                owner.addXp(quest.xpReward);
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

    private indexEntities(entities: Entity[]): Map<EntityId, EntityData> {
        const result = new Map<EntityId, EntityData>();
        for (const entity of entities) {
            result.set(entity.id, entity.getFor(this.data.owner.details));
        }
        return result;
    }

    private sendPlayerData() {
        const { interacting, details } = this.data.owner;

        const { info } = this.data.owner.details;

        const playerState: PlayerState = {
            interaction: !interacting ? null : interacting.getInteractionsFor(details),
            character: {
                xp: info.xp,
                level: info.level,
                id: this.data.character.id,
            },
        };

        const diffs = this.playerStateDiff.update(playerState);

        if (diffs !== null) {
            this.context.sendCommand('playerState', diffs);
        }
    }

    private sendQuestLog() {
        const questLog = this.data.owner.details.questLog;

        const qLogByQ = new Map<QuestId, QuestLogItem>();

        questLog.forEach((status, id) => qLogByQ.set(id, { info: questInfoMap.get(id)!, status }));

        const diffs = this.questLogDiff.update(qLogByQ);

        if (diffs !== null) {
            this.context.sendCommand('questLog', diffs);
        }
    }

    private sendWorldData() {
        const { character, zone } = this.data;

        const distance = this.detectionDistance;
        const { x, y } = character.get().position;
        const entities = zone.query(x - distance, y - distance, x + distance, y + distance);
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


function isCreature(entityData: EntityData): entityData is CreatureEntityData {
    return entityData.type === 'humanoid' || entityData.type === 'monster';
}