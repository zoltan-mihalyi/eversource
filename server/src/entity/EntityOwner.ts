import { questsById } from '../quest/QuestIndexer';
import { matchesEvent, Tasks } from '../quest/Quest';
import { Entity } from './Entity';
import { canInteract } from '../../../common/game/Interaction';
import { CharacterDetails, QuestProgression } from '../character/CharacterDetails';
import { QuestId, QuestInfo, TaskInfo } from '../../../common/domain/InteractionTable';
import { maxXpFor } from '../../../common/algorithms';

export class EntityOwner {
    emit(eventType: string, payload?: any): void {
    }

    removeEntity(): void {
    }

    update(entity: Entity) {
    }
}

export class PlayerEntityOwner extends EntityOwner {
    interacting?: Entity;

    constructor(readonly details: CharacterDetails) {
        super();
    }

    emit(eventType: string, payload?: any) {
        const { questLog } = this.details;

        if (eventType === 'kill') {
            this.addXp(30);
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
                if (matchesEvent(task, eventType, payload)) {
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
        const entity = this.interacting;
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
        }
    }

    update(entity: Entity) {
        if (this.interacting && !canInteract(entity.get(), this.interacting.getFor(this.details))) {
            this.interacting = void 0;
        }
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
}
