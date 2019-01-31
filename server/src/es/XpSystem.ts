import { EventBus } from '../../../common/es/EventBus';
import { ServerEvents } from './ServerEvents';
import { maxXpFor, mobXpReward } from '../../../common/algorithms';
import { ServerComponents } from './ServerComponents';

export function xpSystem(eventBus: EventBus<ServerEvents>) {
    eventBus.on('kill', ({ killer, killed }) => {
        const killedLevel = killed.components.level;

        if (!killedLevel) {
            return;
        }
        addXp(killer.components, mobXpReward(killedLevel.value));
    });

    eventBus.on('completeQuest', ({ entity, quest }) => {
        addXp(entity.components, quest.xpReward);
    });
}

function addXp(components: Partial<ServerComponents>, amount: number) {
    const { xp, level } = components;
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

    components.xp = { value: newXp };
    components.level = { value: newLevel };
}
