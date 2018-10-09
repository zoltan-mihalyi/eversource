export const DEFAULT = 'default';
export const GOLDEN = 'golden';

export function registerCursors(cursorStyles: any) {
    cursorStyles[DEFAULT] = 'url("cursors/default.png"), auto';
    cursorStyles[GOLDEN] = 'url("cursors/golden.png"), auto';
}
