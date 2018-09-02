declare module 'tmx-parser' {
    interface Map {
        version: string;
        width: number;
        height: number;
        tileWidth: number;
        tileHeight: number;
        layers: Layer[];
        tileSets: TileSet[];
    }

    interface BaseLayer {
        name: string;
    }

    interface TileLayer extends BaseLayer {
        tiles: Tile[];
    }

    interface ObjectLayer extends BaseLayer {

    }

    type Layer = TileLayer | ObjectLayer;

    interface TileSet {

    }

    interface Tile {
        terrain: Terrain[]
    }

    interface Terrain {
        name: string;
    }

    function parseFile(filename: string, cb: (err: any, map?: Map) => void): void;
}