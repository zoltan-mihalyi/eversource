import { Quest } from '../src/quest/Quest';
import { QuestId } from '../../common/domain/InteractionTable';

export const quests: Quest[] = [{
    id: 1 as QuestId,
    name: 'A simple quest',
    startsAt: 'cacal',
    endsAt: 'cacal',
    description: 'Kill 10 lava slimes!',
    requires: [],
    tasks: [],
}, {
    id: 2 as QuestId,
    name: 'What next',
    startsAt: 'cacal',
    endsAt: 'nefag',
    description: 'You killed slimes, tell it to Nefag!',
    requires: [1 as QuestId],
    tasks: [],
}, {
    id: 3 as QuestId,
    name: 'The lonely forester',
    startsAt: 'nefag',
    endsAt: 'diana',
    description: 'This is the last tree of my beautiful forest. Tell Diana I love her!',
    requires: [],
    tasks: [],
}, {
    id: 4 as QuestId,
    name: 'A forester without job',
    startsAt: 'nefag',
    endsAt: 'cacal',
    description: 'Help the forester to find a job!',
    requires: [],
    tasks: [],
}, {
    id: 5 as QuestId,
    name: 'The queen bee',
    startsAt: 'diana',
    endsAt: 'diana',
    description: 'Bring the sting of the queen bee!',
    requires: [],
    tasks: [],
}, {
    id: 6 as QuestId,
    name: 'Strange guests',
    startsAt: 'dark',
    endsAt: 'protector',
    description: 'Investigate the lava slimes!',
    requires: [],
    tasks: [
        { count: 1, type: 'visit', name: 'slimes' },
    ],
}];