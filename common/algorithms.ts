import { QuestDifficulty } from '../server/src/quest/Quest';

export function maxXpFor(level: number): number {
    return 100 + level * 100;
}

export function hpForLevel(level: number): number {
    return 100 + level * 50;
}

export function baseXpReward(level: number) {
    return Math.sqrt(level) * 15;
}

export function questXpReward(questLevel: number, difficulty: QuestDifficulty) {
    const base = baseXpReward(questLevel * 8);

    switch (difficulty) {
        case 'easy':
            return round(base / 2);
        case 'normal':
            return round(base);
        case 'hard':
            return round(base * 2);
    }
}

export function basicAttack(level: number): number {
    return 30 + level * 15;
}

export function mobXpReward(level: number) {
    return round(baseXpReward(level));
}

function round(xp: number): number {
    const roundTo = Math.pow(10, Math.floor(Math.log10(xp)) - 1);
    return Math.round(xp / roundTo) * roundTo;
}
