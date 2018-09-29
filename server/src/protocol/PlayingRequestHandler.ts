import { ClientState } from './ClientState';
import { Zone } from '../world/Zone';
import { CharacterSelectionRequestHandler } from './CharacterSelectionRequestHandler';
import { Diff } from '../../../common/protocol/Diff';
import { Entity } from '../entity/Entity';
import { CreatureEntity } from '../entity/CreatureEntity';
import { EntityData } from '../../../common/domain/EntityData';
import { PlayerController } from '../entity/controller/PlayerController';

export interface PlayerData {
    zone: Zone;
    character: CreatureEntity;
    controller: PlayerController;
}

export class PlayingRequestHandler extends ClientState<PlayerData> {
    private lastSent: Map<Entity, EntityData> | null = null;
    private detectionDistance = 15;

    leave() {
        this.cleanup();
        this.manager.enter(CharacterSelectionRequestHandler, void 0);
    }

    command(data: string) {
        const separatorIndex = data.indexOf(':');
        const command = separatorIndex === -1 ? data : data.substring(0, separatorIndex); // todo duplicate
        const params = separatorIndex === -1 ? '' : data.substring(separatorIndex + 1);

        switch (command) {
            case 'move': {
                const split = params.split(',');
                if (split.length !== 2) {
                    return;
                }
                const sX = parseFloat(split[0]);
                const sY = parseFloat(split[1]);
                if (!validNumber(sX) || !validNumber(sY)) {
                    return;
                }
                this.data.controller.move(sX, sY);
            }
        }
    }

    onEnter() {
        this.context.networkLoop.add(this.networkUpdate);
    }

    handleExit() {
        this.cleanup();
    }

    private cleanup() {
        const { zone, character } = this.data;

        this.context.networkLoop.remove(this.networkUpdate);
        zone.removeEntity(character);
    }

    private networkUpdate = () => {
        const { character, zone } = this.data;

        const distance = this.detectionDistance;
        const { x, y } = character.get().position;
        const entities = zone.query(x - distance, y - distance, x + distance, y + distance);
        const entityMap = indexEntities(entities);

        const lastSent = this.lastSent;
        if (lastSent === null) {
            const diffs = entities.map(entity => this.createDiff(entity));
            this.context.sendCommand('diffs', diffs);
        } else {
            const diffs: Diff[] = [];

            entityMap.forEach((object, entity) => {
                const previousObject = lastSent.get(entity);
                if (!previousObject) {
                    diffs.push(this.createDiff(entity));
                } else {
                    let hasDiff = false;
                    const changes: Partial<EntityData> = {};
                    for (const key of Object.keys(object) as (keyof EntityData)[]) {
                        if (object[key] !== previousObject[key]) {
                            hasDiff = true;
                            changes[key] = object[key];
                        }
                    }
                    if (hasDiff) {
                        diffs.push({ type: 'change', id: entity.id, changes })
                    }
                }
            });

            lastSent.forEach((object, entity) => {
                if (!entityMap.has(entity)) {
                    diffs.push({ type: 'remove', id: entity.id });
                }
            });

            if (diffs.length !== 0) {
                this.context.sendCommand('diffs', diffs);
            }
        }

        this.lastSent = entityMap;
    };

    private createDiff(entity: Entity): Diff {
        return {
            id: entity.id,
            type: 'create',
            self: entity === this.data.character,
            data: entity.get(),
        };
    }
}

function validNumber(num: number): boolean {
    return !isNaN(num) && isFinite(num);
}

function indexEntities(entities: Entity[]): Map<Entity, EntityData> {
    const result = new Map<Entity, EntityData>();
    for (const entity of entities) {
        result.set(entity, entity.get());
    }
    return result;
}