import { Opaque } from '../util/Opaque';

export type TileId = Opaque<number, 'TileId'>;
export type TerrainId = Opaque<number, 'TerrainId'>;

export interface TiledProperties {
    [key: string]: string | boolean | number | undefined;
}

export interface Terrain {
    name: string;
    tile: TileId;
    properties?: TiledProperties;
}

export interface Animation {
    duration: number;
    tileid: TileId;
}

export interface Tile {
    terrain?: TerrainId[];
    animation?: Animation[];
}

export interface TileSet {
    columns: number;
    image: string; // TODO relative???
    imageheight: number;
    imagewidth: number;
    margin: number;
    name: string;
    spacing: number;
    terrains?: Terrain[];
    tilecount: number;
    tileheight: number;
    tiles?: { [key: string]: Tile | undefined };
    tileproperties?: { [key: string]: TiledProperties |undefined };
    tilewidth: number;
    type: 'tileset';
}

export interface TileMap {
    height: number;
    infinite: boolean;
    layers: Layer[];
    nextobjectid: number;
    orientation: "orthogonal";
    renderorder: "right-down";
    tiledversion: string;
    tileheight: number;
    tilesets: TileSetRef[];
    tilewidth: number;
    type: "map";
    version: 1;
    width: number;
}

export interface TileSetRef {
    firstgid: number;
    source: string;
}

interface BaseLayer {
    name: string;
}

export interface TileLayer extends BaseLayer {
    compression?: 'zlib';
    data: string;
    encoding: 'base64';
    height: number;
    opacity: number;
    type: 'tilelayer';
    visible: boolean;
    width: number;
    x: number;
    y: number;
}

export interface ObjectLayer extends BaseLayer {
    type: 'objectgroup';
    objects: TiledObject[];
}

export interface TiledObject {
    properties?: TiledProperties;
    height: number;
    id: number;
    name: string;
    rotation: number;
    type: string;
    visible: boolean;
    width: number;
    x: number;
    y: number;
}

export type Layer = TileLayer | ObjectLayer;