import { ItemQuality } from '../../../common/protocol/ItemInfo';

export const black = '#000000';

export const dark = '#2b2b2b';

export const disabled = '#949494';

export const brown = {
    darkest: '#573726',
    darker: '#6e4d31',
    normalDark: '#986a20',
    normal: '#b78c41',
    lighter: '#ccbd7b',
    lightest: '#eae2bc',
};

export const red = {
    darkest: '#580000',
    darker: '#9a0000',
    normal: '#cc0000',
};

export const level = {
    lowest: '#c6c6c6',
    lower: '#91ef53',
    normal: '#efec88',
    higher: '#edac65',
    highest: '#ef501e',
};

export const quest = {
    active: '#ffff00',
    inactive: '#c0c0c0',
};

export const xp = {
    bright: '#8a60eb',
    foreground: '#472093',
    background: '#797979',
};


export const player = '#6e96db';

export const attitude = {
    self: '#00cc2c',
    friendly: '#6e96db',
    neutral: '#e1e000',
    hostile: '#cc0000',
};

export const quality: { [P in ItemQuality]: string } = {
    common: '#f1e7d0',
    rare: '#3e6dde',
    epic: '#9325d7',
    legendary: '#fb4473',
};

export const lore = '#eebd15';
