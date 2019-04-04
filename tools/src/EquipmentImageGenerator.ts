import * as fs from "fs";
import { TileSet } from '../../common/tiled/interfaces';
import * as path from "path";
import { wwwDir } from './Utils';
import { Palettes } from '../../client/src/game/Palettes';
import { colorToNumber } from '../../client/src/utils';
import { EquipmentSlotId } from '../../common/domain/CharacterInfo';

const basePath = 'file://' + path.join(wwwDir, 'spritesheets');

const DEFAULT_ITEM_CONFIG: RequiredGeneratorItemConfig = {
    offsetX: 0,
    offsetY: 12,
};

interface GeneratorItemConfig {
    offsetX?: number;
    offsetY?: number;
}

type RequiredGeneratorItemConfig = Required<GeneratorItemConfig>;

interface GeneratorItemConfigMap {
    [image: string]: GeneratorItemConfig | undefined;
}

type GeneratorConfig = {
    [P in EquipmentSlotId]: GeneratorItemConfig | GeneratorItemConfigMap | undefined;
}

function generatorItemConfig(generatorConfig: GeneratorConfig, category: EquipmentSlotId, image: string): RequiredGeneratorItemConfig {
    const itemConfigOrMap = generatorConfig[category];

    if (itemConfigOrMap) {
        const itemConfig = image in itemConfigOrMap ? (itemConfigOrMap as GeneratorItemConfigMap)[image] : itemConfigOrMap;

        return {
            ...DEFAULT_ITEM_CONFIG,
            ...itemConfig,
        };
    }

    return DEFAULT_ITEM_CONFIG;
}

const DIRECTIONS = ['up', 'left', 'down', 'right'];


function loadImage(src: string, cacheKey: string): Promise<HTMLImageElement> {
    return new Promise<HTMLImageElement>((resolve, reject) => {
        const img = document.createElement('img');
        img.src = `${src}?c=${cacheKey}`;

        img.onload = () => {
            resolve(img);
        };
        img.onerror = reject;
    });
}

function recolor(category: string, image: string, color: string, ctx: CanvasRenderingContext2D) {
    const palette = JSON.parse(fs.readFileSync(`${basePath.replace('file://', '')}/character/${category}/${image}/palettes.json`, 'utf-8')) as Palettes;

    const baseColors = palette.base.map(info => colorToNumber(info.color)).map(decompose);
    const targetColors = palette.variations[color as string].map(colorToNumber).map(decompose); // TODO check if exists

    const canvas = ctx.canvas;
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {

        for (let j = 0; j < baseColors.length; j++) {
            const baseColor = baseColors[j];
            const targetColor = targetColors[j];

            if (data[i] == baseColor[0] &&
                data[i + 1] == baseColor[1] &&
                data[i + 2] == baseColor[2]
            ) {
                data[i] = targetColor[0];
                data[i + 1] = targetColor[1];
                data[i + 2] = targetColor[2];
            }
        }
    }

    ctx.putImageData(imageData, 0, 0);
}

export async function generateEquipmentImage(file: string) {
    try {
        await generateEquipmentImageInner(file);
        alert('Finished');
    } catch (e) {
        alert('Error! Check the console!');
    }
}

async function generateEquipmentImageInner(file: string) {
    const generatorInfo = JSON.parse(fs.readFileSync('data/equipment-image-generator.json', 'utf-8')) as GeneratorConfig;
    const tileSet = JSON.parse(fs.readFileSync(file, 'utf-8')) as TileSet;

    const imageFile = path.resolve(path.dirname(file), tileSet.image);

    const cacheKey = new Date().getTime().toString();
    const image = await loadImage(imageFile, cacheKey);
    const imageCanvas = document.createElement('canvas');
    imageCanvas.width = image.width;
    imageCanvas.height = image.height;
    const imageCtx = imageCanvas.getContext('2d')!;
    imageCtx.drawImage(image, 0, 0);

    const tileProperties = tileSet.tileproperties || {};
    for (const tileKey of Object.keys(tileProperties)) {
        const props = tileProperties[tileKey]!;
        let { category, image, color, direction } = props;

        if (!category) {
            continue;
        }
        direction = (direction || 'down') as string;

        const tileId = +tileKey;
        const column = tileId % tileSet.columns;
        const row = Math.floor(tileId / tileSet.columns);

        const canvas = document.createElement('canvas');
        canvas.width = tileSet.tilewidth;
        canvas.height = tileSet.tileheight;
        const ctx = canvas.getContext('2d')!;

        const img = await loadImage(`${basePath}/character/${category}/male/${image}.png`, cacheKey);
        const itemConfig = generatorItemConfig(generatorInfo, category as EquipmentSlotId, image as string);
        ctx.drawImage(img, -16 - itemConfig.offsetX, -(8 + DIRECTIONS.indexOf(direction)) * 64 - itemConfig.offsetY);

        if (color) {
            recolor(category as string, image as string, color as string, ctx);
        }

        imageCtx.clearRect(column * tileSet.tilewidth, row * tileSet.tileheight, tileSet.tilewidth, tileSet.tileheight);
        imageCtx.drawImage(canvas, column * tileSet.tilewidth, row * tileSet.tileheight);
    }

    saveImage(imageCanvas, imageFile);
}

function decompose(color: number) {
    return [(color >> 16), (color >> 8 & 255), (color & 255)];
}


function saveImage(canvas: HTMLCanvasElement, file: string) {
    const base64Data = canvas.toDataURL('image/png').replace(/^data:image\/png;base64,/, '');
    fs.writeFileSync(file, base64Data, 'base64');
}
