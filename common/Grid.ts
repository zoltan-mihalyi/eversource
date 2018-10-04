export const enum GridBlock {
    EMPTY,
    FULL,
    TOP_LEFT,
    TOP_RIGHT,
    BOTTOM_LEFT,
    BOTTOM_RIGHT,
}

export class Grid {
    constructor(private width: number, private height: number, private data: GridBlock[]) {
    }

    getBlock(x: number, y: number): GridBlock {
        if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
            return GridBlock.EMPTY;
        }
        return this.data[x + y * this.width];
    }
}