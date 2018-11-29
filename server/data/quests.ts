import { Quest } from '../src/quest/Quest';
import { QuestId } from '../../common/domain/InteractionTable';

export const quests: Quest[] = [{
    id: 1 as QuestId,
    name: 'A simple quest',
    startsAt: 'cacal',
    endsAt: 'cacal',
    description: 'The lava slimes are causing so much trouble these days!',
    taskDescription: 'Lava slimes live near lava holes. Get rid of them!',
    completion: 'Wasn\'t that hard, was it?',
    requires: [7 as QuestId],
    tasks: {
        progress: 'Have you slain the lava slimes?',
        list: [
            { type: 'kill', count: 10, title: 'Intruders slain' },
        ],
    },
}, {
    id: 2 as QuestId,
    name: 'What next',
    startsAt: 'cacal',
    endsAt: 'nefag',
    description: 'You killed slimes, tell it to Nefag!',
    taskDescription: 'Nefag is a forester standing on the remainings of the forest. Talk to him!',
    completion: 'Thank you, traveller!',
    requires: [1 as QuestId],
}, {
    id: 3 as QuestId,
    name: 'The lonely forester',
    startsAt: 'nefag',
    endsAt: 'diana',
    description: 'I am so lonely here. I am dreaming of Diana all day. Tell Diana I love her!',
    taskDescription: 'Diana likes walking near the corn fields. Find her and tell them how Nefag feels!',
    completion: 'Nefag told you, he loves me? I love him too!',
    requires: [],
}, {
    id: 4 as QuestId,
    name: 'A forester without job',
    startsAt: 'nefag',
    endsAt: 'cacal',
    description: 'Help the forester to find a job!',
    taskDescription: 'Cacal can help finding a job. Speak to her!',
    completion: 'He can work in my shop.',
    requires: [],
}, {
    id: 5 as QuestId,
    name: 'The queen bee',
    startsAt: 'diana',
    endsAt: 'diana',
    description: 'I need an amulet made of the sting of the queen bee. I\'ll pay you well, if you help me.',
    taskDescription: 'Kill the queen bee and bring their sting!',
    completion: 'Yes! This is it!',
    requires: [],
    tasks: {
        progress: 'Have you found the queen bee? It is the biggest one with golden sting!',
        list: [
            { type: 'item', count: 1, title: 'Sting of the queen bee' },
        ],
    },
}, {
    id: 6 as QuestId,
    name: 'Strange guests',
    startsAt: 'dark',
    endsAt: 'protector',
    description: 'Investigate the lava slimes!',
    taskDescription: 'There are a bunch of lava slimes eastward. Find them!',
    completion: 'Hmm, interesting.',
    requires: [],
    tasks: {
        progress: 'Have you find them?',
        list: [
            { count: 1, type: 'visit', areaName: 'slimes', title: 'Visit eastern slimes' },
        ],
    },
}, {
    id: 7 as QuestId,
    name: 'Trust issues',
    startsAt: 'cacal',
    endsAt: 'cacal',
    description: 'I am not sure if we can trust you. Answer me: are the lava slimes your friends?',
    taskDescription: 'Answer the question!',
    completion: 'The lava slimes are your enemies? I was hoping you\'d say that. Come, I have some tasks for you.',
    requires: [],
}];