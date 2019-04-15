import * as fs from 'fs';
import * as path from 'path';
import * as pako from 'pako';
import { LargeToSmallMapping } from './TileMapping';
import { Layer, TileId, TileLayer, TileMap, TileSet, TileSetRef } from '../../../common/tiled/interfaces';

function readData(layer: TileLayer): number[] {
    if (layer.compression !== 'zlib') {
        throw new Error(`Compression not supported: ${layer.compression}`);
    }
    if (layer.encoding !== 'base64') {
        throw new Error(`Encoding not supported: ${layer.compression}`);
    }
    const data = Buffer.from(layer.data, 'base64');

    const buffer = Buffer.from(pako.inflate(data));
    const size = buffer.length / 4;
    const result = new Array(size);
    for (let i = 0; i < size; i++) {
        result[i] = buffer.readInt32LE(i * 4);
    }

    return result;
}

function encodeData(data: number[]): string {
    const buffer = new Buffer(data.length * 4);
    for (let i = 0; i < data.length; i++) {
        buffer.writeInt32LE(data[i], i * 4);
    }

    return Buffer.from(pako.deflate(new Uint8Array(buffer))).toString('base64');
}

function hasTerrain(data: number[], begin: number, count: number) {
    const end = begin + count;
    return data.findIndex(i => i >= begin && i < end) !== -1;
}

function splitLayers(original: TileLayer, data: number[], mapping: LargeToSmallMapping, begin: number, count: number, shift: number): TileLayer[] {
    const result: TileLayer[] = [];

    const newIds = data.map(packedId => {
        if (packedId < begin) {
            return [packedId];
        }
        if (packedId >= begin + count) {
            return [packedId + shift];
        }
        return mapping.mapId(packedId - begin as TileId).map(id => id + begin);
    });

    for (let i = 0; i < 5; i++) {
        result.push({
            ...original,
            name: `${original.name}$${i}`,
            data: encodeData(newIds.map((ids => (ids[i] || 0) as TileId))),
        });
    }
    return result;

}

export function convertMap(src: string, tileMap: TileMap, large: string, small: string): string {
    const mapDir = path.dirname(src);
    const largeTileSet = JSON.parse(fs.readFileSync(path.resolve(mapDir, large), 'utf-8')) as TileSet;
    const smallTileSet = JSON.parse(fs.readFileSync(path.resolve(mapDir, small), 'utf-8')) as TileSet;
    const mapping = new LargeToSmallMapping(largeTileSet, smallTileSet);


    const newTilesets: TileSetRef[] = [];
    let shift = 0;
    let begin: number;
    for (const tileset of tileMap.tilesets) {
        newTilesets.push({
            ...tileset,
            source: tileset.source === large ? small : tileset.source,
            firstgid: tileset.firstgid + shift,
        });
        if (tileset.source === large) {
            begin = tileset.firstgid;
            shift = smallTileSet.tilecount - largeTileSet.tilecount;
        }
    }

    const newLayers: Layer[] = [];
    for (const layer of tileMap.layers) {
        if (layer.type !== 'tilelayer') {
            continue;
        }
        const data = readData(layer);
        if (hasTerrain(data, begin!, largeTileSet.tilecount)) {
            newLayers.push(...splitLayers(layer, data, mapping, begin!, largeTileSet.tilecount, shift));
        } else {
            newLayers.push({
                ...layer,
                data: encodeData(data.map(packedId => {
                    if (packedId < begin) {
                        return packedId;
                    }
                    if (packedId >= begin + largeTileSet.tilecount) {
                        return packedId + shift;
                    }
                    throw new Error('!!!');
                })),
            });
        }
    }

    const outMap = {
        ...tileMap,
        layers: newLayers,
        tilesets: newTilesets,
    };

    return JSON.stringify(outMap);
}
