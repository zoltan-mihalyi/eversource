import { EntityContainer } from '../../../../common/es/EntityContainer';
import { ClientComponents } from '../../es/ClientComponents';
import { PartialPick } from '../../../../common/util/Types';
import { Activity, Direction } from '../../../../common/components/CommonComponents';
import AdjustmentOptions = PIXI.filters.AdjustmentOptions;

export function displayEffectsSystem(container: EntityContainer<ClientComponents>) {
    const effects = container.createQuery('display', 'effects');
    container.createQuery('display', 'effects', 'direction', 'activity').on('update', updateEffects); // TODO

    effects.on('add', updateEffects);
    effects.on('update', updateEffects);
    effects.on('remove', ({ display }) => display.spriteContainer.setEffectFilters([], {}));
}

function updateEffects({ display, effects, direction, activity }: PartialPick<ClientComponents, 'display' | 'effects'>) {

    const effectFilters: PIXI.Filter<any>[] = [];
    const adjustmentOptions: AdjustmentOptions = {};

    for (const effect of effects) {
        switch (effect.type) {
            case 'speed': {
                const [vx, vy] = directionVelocity(direction, activity);
                const str = effect.param * 20;
                effectFilters.push(display.effectCache.getSpeedEffect(vx * str, vy * str));
                break;
            }
            case 'alpha':
                setOptions(adjustmentOptions, {
                    alpha: effect.param,
                });
                break;
            case 'poison':
                setOptions(adjustmentOptions, {
                    red: 0.3,
                    green: 0.7,
                    blue: 0.2,
                });
                break;
            case 'fire':
                setOptions(adjustmentOptions, {
                    blue: 0,
                    green: 0.3,
                });
                break;
            case 'ice':
                setOptions(adjustmentOptions, {
                    green: 0.6,
                    red: 0.3,
                });
                break;
            case 'stone':
                setOptions(adjustmentOptions, {
                    saturation: 0,
                    contrast: 0.6,
                });
                break;
            case 'light':
                setOptions(adjustmentOptions, {
                    gamma: 1.3,
                    brightness: 1.2,
                    red: 1.5,
                    green: 1.3,
                });
                break;
        }
    }

    display.spriteContainer.setEffectFilters(effectFilters, adjustmentOptions);
}

function directionVelocity(direction?: Direction, activity?: Activity): [number, number] {

    if (!direction || activity !== 'walking') {
        return [0, 0];
    }

    switch (direction) {
        case 'left':
            return [-1, 0];
        case 'up':
            return [0, -1];
        case 'right':
            return [1, 0];
        case 'down':
            return [0, 1];
    }
}

function setOptions(options: AdjustmentOptions, values: Partial<AdjustmentOptions>) {
    for (const key of Object.keys(values) as (keyof AdjustmentOptions)[]) {
        const value = values[key]!;
        const existing = options[key];
        options[key] = existing === void 0 ? value : existing * value;
    }
}
