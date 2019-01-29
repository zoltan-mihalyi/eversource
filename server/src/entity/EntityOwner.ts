import { questsById } from '../quest/QuestIndexer';
import { matchesEvent, Tasks } from '../quest/Quest';
import { Entity, EntityEvent } from './Entity';
import { canInteract } from '../../../common/game/Interaction';
import { CharacterDetails, QuestProgression } from '../character/CharacterDetails';
import { QuestId, QuestInfo, TaskInfo } from '../../../common/domain/InteractionTable';
import { maxXpFor, mobXpReward } from '../../../common/algorithms';
import { CreatureEntity } from './CreatureEntity';
import { EntityReference, ReferenceReason } from './EntityReference';
import { Zone } from '../world/Zone';

export class EntityOwner<E extends Entity = Entity> {
    protected entity!: E;
    private backReferences = new Set<EntityReference>();

    constructor(protected zone: Zone) {
    }

    referenced(reference: EntityReference) {
        this.backReferences.add(reference);
    }

    dereferenced(reference: EntityReference) {
        this.backReferences.delete(reference);
    }

    isReferenced(reason: ReferenceReason): boolean {
        let found = false;
        this.backReferences.forEach(ref => {
            if (ref.reason === reason) {
                found = true;
            }
        });
        return found;
    }

    emit(event: EntityEvent): void {
    }

    removeEntity() {
        this.backReferences.forEach(ref => ref.unset());
        this.zone.removeEntity(this.entity);
    }

    update() {
    }
}

export class PlayerEntityOwner extends EntityOwner<CreatureEntity> {
    private references = new Set<EntityReference>();
    readonly interactingRef: EntityReference = this.createReference('interacting');

    constructor(zone: Zone, readonly details: CharacterDetails,) {
        super(zone);
    }

    setEntity(entity: CreatureEntity) {
        this.entity = entity;
    }

    emit(event: EntityEvent) {
        const { questLog } = this.details;

        if (event.type === 'kill') {
            this.addXp(mobXpReward(event.data.level));
        }

        questLog.forEach((q, questId) => {
            if (q === 'failed') {
                return;
            }
            const tasks = questsById[questId]!.tasks as Tasks | undefined;
            if (!tasks) {
                return;
            }

            tasks.list.forEach((task, i) => {
                if (matchesEvent(task, event)) {
                    this.updateQuest(questId, task, i);
                }
            });
        });
    }

    findQuest(params: string, type: 'acceptable' | 'completable'): QuestInfo | undefined {
        const questId = +params as QuestId;
        if (isNaN(questId)) {
            return;
        }
        const entity = this.interactingRef.get();
        if (!entity) {
            return;
        }
        const interactionTable = entity.getInteractionsFor(this.details);
        return interactionTable[type].find(q => q.id === questId);
    }

    addXp(xp: number) {
        const { info } = this.details;

        info.xp += xp;
        let maxXp;
        while (info.xp >= (maxXp = maxXpFor(info.level))) {
            info.level++;
            info.xp -= maxXp;
            this.entity.setSingle('level', info.level);
            const entityData = this.entity.get();
            console.log(`Level up! ${entityData.name} -> ${entityData.level}`);
        }
    }

    update() {
        const interacting = this.interactingRef.get();
        if (interacting && !canInteract(this.entity.get(), interacting.getFor(this.details))) {
            this.interactingRef.unset();
        }
    }

    removeEntity() {
        super.removeEntity();
        this.references.forEach(ref => ref.unset());
    }

    private updateQuest(questId: QuestId, task: TaskInfo, taskIndex: number) {
        const { questLog } = this.details;
        const oldProgression = questLog.get(questId) as QuestProgression;

        if (oldProgression[taskIndex] === task.count) {
            return;
        }

        const progression = oldProgression.map((progress, index) => {
            if (index === taskIndex) {
                return progress + 1;
            }
            return progress;
        });

        questLog.set(questId, progression);
    }

    private createReference(reason: ReferenceReason): EntityReference {
        const entityReference = new EntityReference(reason);
        this.references.add(entityReference);
        return entityReference;
    }
}
