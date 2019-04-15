import * as PIXI from 'pixi.js';
import { MotionBlurFilter } from "@pixi/filter-motion-blur";

interface Effects {
    motionBlur: PIXI.filters.MotionBlurFilter;
}

export class EffectCache {
    private filters: Partial<Effects> = {};

    getSpeedEffect(vx: number, vy: number) {
        const filter = this.getFilter('motionBlur');
        filter.velocity.set(vx, vy);
        return filter;
    }

    private getFilter<K extends keyof Effects>(key: K): Effects[K] {
        let filter = this.filters[key] as Effects[K] | undefined;
        if (!filter) {
            filter = createFilter(key);
            this.filters[key] = filter;
        }
        return filter;
    }
}

function createFilter<K extends keyof Effects>(key: K): Effects[K] {
    const filter = createRawFilter(key);
    filter.padding = 0;
    return filter;
}

function createRawFilter<K extends keyof Effects>(key: K): Effects[K] {
    switch (key) {
        case 'motionBlur':
            return new MotionBlurFilter([0, 0], 9);
    }
    throw new Error('Unknown filter: ' + key);
}