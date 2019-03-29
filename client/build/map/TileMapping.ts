import { Terrain, TerrainId, TileId, TileSet } from '../../../common/tiled/interfaces';
import { Opaque } from '../../../common/util/Opaque';


type TerrainsKey = Opaque<string, 'TerrainsKey'>;

const TERRAIN_ORDER = 'Sand Earth_Cracked Soil Rock_White Rock_Gray Rock_Dark Rock_Black Dirt_Tan Dirt_Brown Dirt_Dark Snow_1 Snow_2 Water_Purple Water_Green Water_Deep Water Water_Shallows_Dirt Water_Shallows_Sand Ice Ice_Melting Hole_Black Hole_Brown Hole_Brown Mud_Brown Dirt_Roots Mudstone_Gray Mudstone_Brown Stone_White Stone_Tan Grass_Dark Grass_Light Grass_Dead Grass Gravel_1 Lava'.split(' ');

export class LargeToSmallMapping {
    private smallTileIdsByTerrains = new Map<TerrainsKey, TileId[]>();
    private largeTileIdsByTerrains = new Map<TerrainsKey, TileId[]>();
    private terrainIndexMap: TerrainIndexMap;
    private terrainOrder = new Map<TerrainId, number>();

    constructor(private large: TileSet, small: TileSet) {
        fillMap(this.smallTileIdsByTerrains, small);
        fillMap(this.largeTileIdsByTerrains, large);
        this.terrainIndexMap = terrainIndexMap(large.terrains!, small.terrains!);
        large.terrains!.forEach((terrain, id) => {
            this.terrainOrder.set(id as TerrainId, TERRAIN_ORDER.indexOf(terrain.name));
        });
    }

    mapId(largeId: TileId): TileId[] {
        if (largeId === -1) {
            return [largeId];
        }
        const tile = this.large.tiles![largeId];
        if (!tile) {
            throw new Error(`${largeId} does not have terrain!`);
        }
        const terrains = tile.terrain!;

        const key = terrainsKey(terrains);
        const largeTileIdsForTerrain = this.largeTileIdsByTerrains.get(key)!;
        const largeTileIdsNum = largeTileIdsForTerrain.length;
        const idx = largeTileIdsForTerrain.indexOf(largeId);

        const terrainsForTile = [];
        for (let c = 0; c < 4; c++) {
            const terrainFor = terrains[c];
            if (terrainsForTile.indexOf(terrainFor) === -1) {
                terrainsForTile.push(terrainFor);
            }
        }
        terrainsForTile.sort((t1, t2) => this.terrainOrder.get(t1)! - this.terrainOrder.get(t2)!);

        const result: TileId[] = [];
        for (let c = 0; c < terrainsForTile.length; c++) {
            const layerTerrain = terrainsForTile[c];
            const smallTerrain = new Array<TerrainId>(4);
            for (let i = 0; i < 4; i++) {
                const partTerrain = terrains[i];
                smallTerrain[i] = (partTerrain === -1 || partTerrain !== layerTerrain ? -1 : this.terrainIndexMap[partTerrain]) as TerrainId;
            }
            const tileIds = this.smallTileIdsByTerrains.get(terrainsKey(smallTerrain))!;
            result.push(getCorrespondingSmallId(largeTileIdsNum, tileIds, idx));
        }
        if (result.length > 1) { // more than 1 terrain
            const bottomTerrain = this.terrainIndexMap[terrainsForTile[0]];
            const tileIds = this.smallTileIdsByTerrains.get(terrainsKey([bottomTerrain, bottomTerrain, bottomTerrain, bottomTerrain]))!;
            result.unshift(getCorrespondingSmallId(largeTileIdsNum, tileIds, idx));
        }
        return result;
    }
}

type TerrainIndexMap = { [id: number]: TerrainId };

function terrainIndexMap(from: Terrain[], to: Terrain[]): TerrainIndexMap {
    const result: TerrainIndexMap = {};

    from.forEach((terrain, i) => {
        result[i] = to.findIndex(t => t.name === terrain.name) as TerrainId;
    });

    return result;
}

function fillMap(tileIdsByTerrains: Map<TerrainsKey, TileId[]>, tileSet: TileSet) {
    const tiles = tileSet.tiles!;

    for (const tileIdStr of Object.keys(tiles).sort((a, b) => +a - +b)) {
        const tileId = +tileIdStr as TileId;
        const tile = tiles[tileId]!;
        if (!tile.terrain) {
            continue;
        }

        const key = terrainsKey(tile.terrain);
        const tileIds = tileIdsByTerrains.get(key);
        if (tileIds) {
            tileIds.push(tileId);
        } else {
            tileIdsByTerrains.set(key, [tileId]);
        }
    }
}

function terrainsKey(terrains: TerrainId[]): TerrainsKey {
    return terrains.join(',') as TerrainsKey;
}

function getCorrespondingSmallId(largeTileIds: number, smallTileIds: TileId[], idx: number): TileId {
    if (idx === 0) {
        return smallTileIds[0];
    }
    // [0, 1, 2, 3] => [0, , , , , 1, 2, 3]
    const sizeDiff = smallTileIds.length - largeTileIds;
    return smallTileIds[idx + sizeDiff];
}
