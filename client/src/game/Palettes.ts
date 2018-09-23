export type Palette = string[];

interface BaseColorInfo {
    color: string;
    coordinates: [number, number];
}

export interface Palettes {
    base: BaseColorInfo[];
    variations: {
        [key: string]: Palette;
    }
}