export class Grid {
    constructor(private width: number, private heihgt: number, private data: boolean[]) {
    }

    hasBlock(x: number, y: number): boolean {
        return this.data[x + y * this.width];
    }
}