import { WorldImpl } from '../src/world/World';
import * as sinon from 'sinon';
import * as assert from 'assert';
import { ZoneId } from '../../common/domain/Location';
import { MapData, MapLoader } from '../src/world/MapLoader';
import { Grid } from '../../common/Grid';
import { Presets } from '../src/world/Presets';
import { TiledObject } from '../../common/tiled/interfaces';
import { HumanoidEntityData } from '../../common/domain/HumanoidEntityData';

const zoneId = 'zone' as ZoneId;

function createMapLoader(objects: TiledObject[] = []) {
    return {
        load: sinon.mock().returns(Promise.resolve<MapData>({
            grid: {} as Grid,
            objects,
            tileWidth: 32,
            tileHeight: 32,
        }))
    };
}

const runningWorlds = new Set<WorldImpl>();

function newWorld(mapLoader: MapLoader, presets = {}) {
    const world = new WorldImpl(mapLoader, presets);
    runningWorlds.add(world);
    return world;
}

describe('World', function () {
    afterEach(function () {
        runningWorlds.forEach(world => world.stop());
        runningWorlds.clear();
    });

    it('should load and return zone', async function () {

        const mapLoader = createMapLoader();
        const world = newWorld(mapLoader);

        const zone = await world.getZone(zoneId);

        assert(zone != null);

        sinon.assert.calledOnce(mapLoader.load);
    });

    it('should resolve parallel getZone calls but call mapLoader.load only once', async function () {
        const mapLoader = createMapLoader();
        const world = newWorld(mapLoader);

        const zones = await Promise.all([world.getZone(zoneId), world.getZone(zoneId)]);

        assert(zones[0] === zones[1]);

        sinon.assert.calledOnce(mapLoader.load);
    });

    it('should add npc characters', async function () {
        const mapLoader = createMapLoader([
            {
                type: 'npc',
                name: 'orc',
                x: 320,
                y: 320,
                properties: {},
            } as TiledObject,
            {
                properties: {}
            } as TiledObject
        ]);
        const presets: Presets = {
            orc: {
                "appearance": {
                    "sex": "female",
                    "body": ["orc"],
                    "eyes": [],
                    "ears": [],
                    "hair": [],
                    "nose": []
                },
                "equipment": {
                    "chest": [],
                    "shirt": [],
                    "feet": ["brown_shoes"],
                    "head": [],
                    "legs": ["maroon_pants"]
                }
            }
        };
        const world = newWorld(mapLoader, presets);
        const zone = await world.getZone(zoneId);

        const entities = zone.query(10, 10, 10, 10);
        assert.strictEqual(entities.length, 1);
        const entityData = entities[0].get();
        assert.strictEqual((entityData as HumanoidEntityData).appearance, presets.orc.appearance);

    });
});