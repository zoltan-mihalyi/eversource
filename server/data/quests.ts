import { Quest } from '../src/quest/Quest';
import { QuestId } from '../../common/domain/InteractionTable';

export const quests: Quest[] = [{
    id: 1 as QuestId,
    name: 'A simple quest',
    startsAt: 'cacal',
    endsAt: 'cacal',
    description: 'The lava slimes are causing so much trouble these days!',
    completion: 'Wasn\'t that hard, was it?',
    requires: [],
    tasks: [
        { type: 'kill', count: 10, title: 'Intruders slain' },
    ],
}, {
    id: 2 as QuestId,
    name: 'What next',
    startsAt: 'cacal',
    endsAt: 'nefag',
    description: 'You killed slimes, tell it to Nefag!',
    completion: 'Thank you, traveller!',
    requires: [1 as QuestId],
    tasks: [],
}, {
    id: 3 as QuestId,
    name: 'The lonely forester',
    startsAt: 'nefag',
    endsAt: 'diana',
    description: 'This is the last tree of my beautiful forest. Tell Diana I love her!',
    completion: 'I love Nefag too!',
    requires: [],
    tasks: [],
}, {
    id: 4 as QuestId,
    name: 'A forester without job',
    startsAt: 'nefag',
    endsAt: 'cacal',
    description: 'Help the forester to find a job!',
    completion: 'He can work in my shop.',
    requires: [],
    tasks: [],
}, {
    id: 5 as QuestId,
    name: 'The queen bee',
    startsAt: 'diana',
    endsAt: 'diana',
    description: 'I need an amulet made of the sting of the queen bee. I\'ll pay you well, if you help me.',
    completion: 'Yes! This is it!',
    requires: [],
    tasks: [
        { type: 'item', count: 1, title: 'Sting of the queen bee' },
    ],
}, {
    id: 6 as QuestId,
    name: 'Strange guests',
    startsAt: 'dark',
    endsAt: 'protector',
    description: 'Investigate the lava slimes!',
    completion: 'Hmm, interesting.',
    requires: [],
    tasks: [
        { count: 1, type: 'visit', areaName: 'slimes', title: 'Visit eastern slimes' },
    ],
}];