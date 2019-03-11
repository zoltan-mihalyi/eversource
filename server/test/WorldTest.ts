import { AllPresets, WorldImpl } from '../src/world/World';
import * as sinon from 'sinon';
import * as assert from 'assert';
import { ZoneId } from '../../common/domain/Location';
import { MapData, MapLoader } from '../src/world/MapLoader';
import { Grid } from '../../common/Grid';
import { HumanoidPresets, MonsterPresets, ObjectPresets } from '../src/world/Presets';
import { TiledObject } from '../../common/tiled/interfaces';
import { HumanoidView, ObjectView, SimpleView } from '../../common/components/View';
import { QuestIndexer } from '../src/quest/QuestIndexer';

const zoneId = 'zone' as ZoneId;

function createMapLoader(objects: TiledObject[] = []) {
    return {
        load: sinon.mock().returns(Promise.resolve<MapData>({
            grid: {} as Grid,
            objects,
            tileWidth: 32,
            tileHeight: 32,
        })),
    };
}

const runningWorlds = new Set<WorldImpl>();

function newWorld(mapLoader: MapLoader, presets: Partial<AllPresets> = {}) {
    const world = new WorldImpl(mapLoader, {
        monster: {},
        humanoid: {},
        object: {},
        spells: {},
        items: {},
        ...presets,
    }, new QuestIndexer({}, {}));
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
                width: 32,
                height: 32,
                properties: {},
            } as TiledObject,
            {
                properties: {},
            } as TiledObject,
        ]);
        const presets: HumanoidPresets = {
            orc: {
                "name": "orc",
                "level": 1,
                "appearance": {
                    "sex": "female",
                    "body": ["orc"],
                    "eyes": [],
                    "ears": [],
                    "hair": [],
                    "nose": [],
                    "facial": [],
                },
                "equipment": {
                    "chest": [],
                    "shirt": [],
                    "feet": ["brown_shoes"],
                    "head": [],
                    "arms": [],
                    "hands": [],
                    "legs": ["maroon_pants"],
                    "cape": [],
                    "belt": [],
                    "mask": [],
                },
            },
        };
        const world = newWorld(mapLoader, { humanoid: presets });
        const zone = await world.getZone(zoneId);

        const entities = zone.query(10.5, 10.5, 10.5, 10.5);
        assert.strictEqual(entities.length, 1);
        const view = entities[0].components.view as HumanoidView;
        assert.strictEqual(view.appearance, presets.orc.appearance);
    });

    it('should add monsters', async function () {
        const mapLoader = createMapLoader([
            {
                type: 'monster',
                name: 'lava_slime',
                x: 320,
                y: 320,
                width: 32,
                height: 32,
                properties: {},
            } as TiledObject,
            {
                properties: {},
            } as TiledObject,
        ]);
        const presets: MonsterPresets = {
            lava_slime: {
                "name": "Lava Slime",
                "level": 1,
                "image": "slime",
                "palette": "lava",
            },
        };
        const world = newWorld(mapLoader, { monster: presets });
        const zone = await world.getZone(zoneId);

        const entities = zone.query(10.5, 10.5, 10.5, 10.5);
        assert.strictEqual(entities.length, 1);
        const view = entities[0].components.view as SimpleView;
        assert.strictEqual(view.image, presets.lava_slime.image);
    });


    it('should add objects', async function () {
        const mapLoader = createMapLoader([
            {
                type: 'object',
                name: 'carrot',
                x: 320,
                y: 320,
                width: 32,
                height: 32,
                properties: {},
            } as TiledObject,
        ]);
        const presets: ObjectPresets = {
            carrot: {
                "name": "Carrot",
                "image": "plants",
                "animation": "carrot",
            },
        };
        const world = newWorld(mapLoader, { object: presets });
        const zone = await world.getZone(zoneId);

        const entities = zone.query(10.5, 10.5, 10.5, 10.5);
        assert.strictEqual(entities.length, 1);
        const view = entities[0].components.view as ObjectView;
        assert.strictEqual(view.image, presets.carrot.image);
    });
});
