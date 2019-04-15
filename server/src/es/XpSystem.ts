import { EventBus } from '../../../common/es/EventBus';
import { ServerEvents } from './ServerEvents';
import { maxXpFor, mobXpReward } from '../../../common/algorithms';
import { ServerComponents } from './ServerComponents';
import { Entity } from '../../../common/es/Entity';

export function xpSystem(eventBus: EventBus<ServerEvents>) {
    eventBus.on('kill', ({ killer, killed }) => {
        const killedLevel = killed.components.level;

        if (!killedLevel) {
            return;
        }
        addXp(killer, mobXpReward(killedLevel.value));
    });

    eventBus.on('completeQuest', ({ entity, quest }) => {
        addXp(entity, quest.xpReward);
    });
}

function addXp(entity: Entity<ServerComponents>, amount: number) {
    const { xp, level } = entity.components;
    if (!xp || !level) {
        return;
    }

    let newXp = xp.value + amount;
    let newLevel = level.value;

    let maxXp;
    while (newXp >= (maxXp = maxXpFor(newLevel))) {
        newLevel++;
        newXp -= maxXp;
        console.log(`Level up (${newLevel})!`);
    }

    entity.set('xp', { value: newXp });
    entity.set('level', { value: newLevel });
}
