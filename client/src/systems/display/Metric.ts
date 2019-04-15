import { Position, X, Y } from '../../../../common/domain/Location';

// Game "pixel" which can be one or more real pixel
export interface FragmentPosition {
    x: number
    y: number;
}

export class Metric {
    public scale = 1;

    constructor(private readonly tileWidth: number, private readonly tileHeight: number) {
    }

    round(position: Position): Position {
        const roundX = this.tileWidth * this.scale;
        const roundY = this.tileHeight * this.scale;

        return {
            x: Math.round(position.x * roundX) / roundX as X,
            y: Math.round(position.y * roundY) / roundY as Y,
        };
    }

    toFragmentPosition(position: Position): FragmentPosition {
        const { x, y } = this.round(position);
        return {
            x: x * this.tileWidth,
            y: y * this.tileHeight,
        };
    }
}