import * as path from 'path';
import { ObjectLayer, Tile, TiledProperties, TileMap, TileSet, TileSetRef } from './interfaces';

interface ResolvedTerrain {
    name: string;
    properties: TiledProperties
}

interface ResolvedTile {
    globalId: number;
    terrain?: ResolvedTerrain[];
    properties: TiledProperties
}

export interface ResolvedTileLayer {
    type: 'tilelayer';
    name: string;
    tiles: (ResolvedTile | undefined)[];
}

type ResolvedLayer = ResolvedTileLayer | ObjectLayer;

export interface ResolvedTileSet extends TileSet, TileSetRef {
}

export interface LoadedMap {
    readonly map: TileMap;
    readonly layers: ResolvedLayer[];
    readonly tileSets: ResolvedTileSet[];
}

export interface TileData extends Tile {
    properties: TiledProperties;
}

export function mergeTileData(tileSet: TileSet): TileData[] {
    const tiles = tileSet.tiles || {};
    const tileProperties = tileSet.tileproperties || {};

    const result: TileData[] = [];
    for (let i = 0; i < tileSet.tilecount; i++) {
        result[i] = { properties: {} };
    }

    for (const tileId of Object.keys(tiles)) {
        const tile = tiles[tileId]!;
        const tileData = result[+tileId];
        if (tile.terrain) {
            tileData.terrain = tile.terrain;
        }
        if (tile.animation) {
            tileData.animation = tile.animation;
        }
    }

    for (const tileId of Object.keys(tileProperties)) {
        result[+tileId].properties = tileProperties[tileId]!;
    }

    return result;
}

export async function loadTileSet(readFile: (file: string) => Promise<string>, src: string): Promise<TileSet> {
    return JSON.parse(await readFile(src));
}

//TODO TEST
export async function loadMap(mapFile: string, readFile: (file: string) => Promise<string>, base64Inflate: (str: string) => Uint8Array): Promise<LoadedMap> { // TODO class
    const mapDir = path.dirname(mapFile);
    const map = JSON.parse(await readFile(mapFile)) as TileMap;
    const loadingTileSets = map.tilesets.map(tileset => loadTileSet(readFile, path.join(mapDir, tileset.source)));
    const tileSets = await Promise.all(loadingTileSets);

    const idsToTiles = new Map<number, ResolvedTile>();

    const resolvedTileSets: ResolvedTileSet[] = [];
    tileSets.forEach((tileSet, i) => {
        const tileSetRef = map.tilesets[i];
        const firstGid = tileSetRef.firstgid;
        resolvedTileSets.push({
            ...tileSetRef,
            ...tileSet,
        });

        const resolvedTerrains = (tileSet.terrains || []).map((terrain): ResolvedTerrain => ({
            name: terrain.name,
            properties: terrain.properties || {},
        }));

        const tileData = mergeTileData(tileSet);

        tileData.forEach((tile, i) => {
            const globalId = firstGid + i;
            const resolvedTile: ResolvedTile = {
                globalId,
                properties: tile.properties,
            };
            if (tile.terrain) {
                resolvedTile.terrain = tile.terrain.map(terrainId => resolvedTerrains[terrainId]);
            }
            idsToTiles.set(globalId, resolvedTile);
        });
    });

    const resolvedLayers = map.layers.map((layer): ResolvedLayer => {
        if (layer.type === 'objectgroup') {
            return layer;
        }

        const decompressed = base64Inflate(layer.data);

        const buffer = Buffer.from(decompressed);
        const size = buffer.length / 4;
        const tiles = new Array<ResolvedTile | undefined>(size);
        for (let i = 0; i < size; i++) {
            tiles[i] = idsToTiles.get(buffer.readInt32LE(i * 4));
        }

        return {
            type: 'tilelayer',
            name: layer.name,
            tiles,
        }
    });

    return {
        map,
        layers: resolvedLayers,
        tileSets: resolvedTileSets,
    };
}