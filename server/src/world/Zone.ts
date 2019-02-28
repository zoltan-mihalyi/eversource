import * as rbush from 'rbush';
import { Grid } from '../../../common/Grid';
import { Position } from '../../../common/domain/Location';
import { ServerComponents } from '../es/ServerComponents';
import { EventBus } from '../../../common/es/EventBus';
import { ServerEvents } from '../es/ServerEvents';
import { aiMovingSystem } from '../es/AIMovingSystem';
import { areaSystem } from '../es/AreaSystem';
import { attackSystem } from '../es/AttackSystem';
import { damageSystem } from '../es/DamageSystem';
import { hpRegenSystem } from '../es/HpRegenSystem';
import { movingSystem } from '../es/MovingSystem';
import { questSystem } from '../es/QuestSystem';
import { spawnSystem } from '../es/SpawnSystem';
import { xpSystem } from '../es/XpSystem';
import { Entity, EntityId } from '../../../common/es/Entity';
import { interactionSystem } from '../es/InteractionSystem';
import { PositionBox, spatialIndexingSystem } from '../es/SpatialIndexingSystem';
import { ServerEntityContainer } from '../es/ServerEntityContainer';
import { spellSystem } from '../es/SpellSystem';

export class Zone {
    private entityContainer = new ServerEntityContainer();
    readonly eventBus = new EventBus<ServerEvents>(); // TODO private
    private readonly index: rbush.RBush<PositionBox>;

    constructor(private grid: Grid) {
        spawnSystem(this.entityContainer, this.eventBus);

        this.index = spatialIndexingSystem(this.entityContainer, this.eventBus);
        aiMovingSystem(this.entityContainer, this.eventBus);
        movingSystem(grid, this.entityContainer, this.eventBus);
        areaSystem(this.index, this.entityContainer, this.eventBus);
        attackSystem(this.eventBus);
        damageSystem(this.eventBus);
        hpRegenSystem(this.entityContainer, this.eventBus);
        interactionSystem(this.entityContainer, this.eventBus);
        questSystem(this.eventBus);
        xpSystem(this.eventBus);
        spellSystem(this.eventBus);
    }

    createEntity(components: Partial<ServerComponents>): Entity<ServerComponents> {
        return this.entityContainer.createEntity(components);
    }

    addSpawner(spawnTime: number, template: Partial<ServerComponents>) { // TODO creature builders should be at the same place
        this.createEntity({
            spawner: {
                spawnTime,
                template,
            },
            spawnTimer: {
                nextSpawnTime: 0,
            },
        });
    }

    addArea(center: Position, width: number, height: number, name: string) {
        this.createEntity({
            position: center,
            area: {
                name,
                width,
                height,
            },
        });
    }

    getEntity(id: EntityId): Entity<ServerComponents> | null {
        return this.entityContainer.getEntity(id);
    }

    removeEntity(entity: Entity<ServerComponents>): void {
        this.entityContainer.removeEntity(entity);
    }

    query(minX: number, minY: number, maxX: number, maxY: number): Entity<ServerComponents>[] { // TODO network system
        return this.index.search({ minX, minY, maxX, maxY }).map(box => box.entity);
    }

    update(interval: number) {
        this.eventBus.emit('update', {
            now: Date.now(),
            delta: interval,
            deltaInSec: interval / 1000,
        });
    }

    init() {
        this.eventBus.emit('init', void 0);
    }
}
