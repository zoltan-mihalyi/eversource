import * as React from 'react';
import * as path from 'path';
import * as PIXI from '../../../client/src/pixi';
import { TextureLoader } from '../../../client/src/loader/TextureLoader';
import { CancellableProcess } from '../../../common/util/CancellableProcess';
import { wwwDir } from '../Utils';
import { BasePreset, CreaturePreset, resolvePresetAttitude } from '../../../server/src/world/Presets';
import { EffectEdit } from './EffectEdit';
import { Activity, Direction, Effect } from '../../../common/components/CommonComponents';
import { View } from '../../../common/components/View';
import { EntityContainer } from '../../../common/es/EntityContainer';
import { ClientComponents } from '../../../client/src/es/ClientComponents';
import { EventBus } from '../../../common/es/EventBus';
import { ClientEvents } from '../../../client/src/es/ClientEvents';
import { completeDisplaySystem } from '../../../client/src/systems/display/CompleteDisplaySystem';
import { Metric } from '../../../client/src/systems/display/Metric';
import { Entity, EntityId } from '../../../common/es/Entity';
import { X, Y } from '../../../common/domain/Location';
import { nextValue } from '../../../common/util/utils';

PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

export interface EditPresetProps<T> {
    preset: T;
    onChange: (update: Partial<T>) => void;
}

export type createView<T> = (preset: T) => View;

interface Props<T> {
    item: T;
    onChange: (item: T) => void;
    canCast: boolean;
    BaseEdit: React.ComponentType<EditPresetProps<T>>;
    Edit: React.ComponentType<EditPresetProps<T>>;
    createView: createView<T>;
}

interface State {
    activity: Activity;
    direction: Direction;
}

const process = new CancellableProcess();

const SCALE = 4;
const CANVAS_WIDTH = 192 * SCALE;
const CANVAS_HEIGHT = CANVAS_WIDTH * 0.75;

const DIRECTIONS: Direction[] = [
    'right',
    'down',
    'left',
    'up',
];

export class ShowPreset<T extends BasePreset> extends React.Component<Props<T>, State> {
    private app: PIXI.Application;
    private container = new PIXI.Container();
    private entity: Entity<ClientComponents>;

    constructor(props: Props<T>) {
        super(props);
        this.state = {
            activity: 'walking',
            direction: 'down',
        };

        this.app = new PIXI.Application({
            width: CANVAS_WIDTH,
            height: CANVAS_HEIGHT,
            backgroundColor: 0x2e8036,
        });
        this.container.scale.set(SCALE);
        this.app.stage.addChild(this.container);
        this.container.x = CANVAS_WIDTH / 2;
        this.container.y = CANVAS_HEIGHT * 0.85;

        const basePath = 'file://' + path.join(wwwDir, 'spritesheets');
        const textureLoader = new TextureLoader(this.app.renderer, process, 32, basePath);

        const container = new EntityContainer<ClientComponents>();
        const eventBus = new EventBus<ClientEvents>();

        this.entity = container.createEntityWithId(0 as EntityId, {
            position: { x: 0 as X, y: 0 as Y },
            animation: {
                speed: 2,
            },
        });
        eventBus.on('interact', () => {
            this.setState({
                direction: nextValue(DIRECTIONS, this.state.direction),
            });
        });
        this.app.ticker.add(() => eventBus.emit('render', void 0));

        this.container.addChild(completeDisplaySystem(container, eventBus, new Metric(32, 32), textureLoader));

        this.updateCharacter();
    }

    componentDidUpdate() {
        this.updateCharacter();
    }

    componentWillUnmount() {
        this.app.destroy(true);
    }

    render() {
        const { item, canCast, BaseEdit, Edit } = this.props;

        return (
            <>
                <div className="config">
                    <div>
                        <span className="prop-name">name </span>
                        <input value={item.name} onChange={this.changeName}/>
                        <span className="prop-name">story </span>
                        <input value={item.story} onChange={this.changeStory}/>

                        <BaseEdit preset={item} onChange={this.changePreset}/>

                        <span className="prop-name">scale </span>
                        <input className="small-input" type="number" value={item.scale || 1} step={0.01} min={0.01}
                               onChange={this.changeScale}/>
                    </div>
                    <Edit preset={item} onChange={this.changePreset}/>

                    {isCreaturePreset(item) && (<div className="prop-table">
                            <select onChange={this.changeAnim} value={this.state.activity} size={3}>
                                <option value="standing">Standing</option>
                                <option value="walking">Walking</option>
                                {canCast && <option value="casting">Casting</option>}
                            </select>
                            <select onChange={this.changeDir} value={this.state.direction} size={4}>
                                <option value="left">Left</option>
                                <option value="up">Up</option>
                                <option value="right">Right</option>
                                <option value="down">Down</option>
                            </select>
                            <div>
                                <p className="prop-name">Effects</p>
                                {item.effects && item.effects.map(((effect, i) => (
                                    <EffectEdit key={i} index={i} effect={effect} onChange={this.changeEffect}
                                                onRemove={this.removeEffect}/>
                                )))}
                                <button onClick={this.addEffect}>+</button>
                            </div>
                        </div>
                    )}
                </div>
                <div className="display" ref={this.containerRef}/>
            </>
        );
    }

    private changePreset = (newValues: Partial<CreaturePreset>) => {
        this.props.onChange({
            ...this.props.item as any,
            ...newValues as any,
        });
    };

    private changeName = (e: React.SyntheticEvent<HTMLInputElement>) => {
        this.changePreset({
            name: e.currentTarget.value,
        });
    };

    private changeStory = (e: React.SyntheticEvent<HTMLInputElement>) => {
        this.changePreset({
            story: e.currentTarget.value,
        });
    };
    private changeScale = (e: React.SyntheticEvent<HTMLInputElement>) => {
        this.changePreset({
            scale: +e.currentTarget.value || 1,
        });
    };

    private changeEffect = (index: number, effect: Effect) => {
        const effects = this.props.item.effects!.slice();
        effects[index] = effect;

        this.changePreset({ effects });
    };

    private addEffect = () => {
        const effects: Effect[] = [...this.props.item.effects || [], { type: 'alpha', param: 1 }];

        this.changePreset({ effects });
    };

    private removeEffect = (index: number) => {
        const effects = this.props.item.effects!.slice();
        effects.splice(index, 1);

        this.changePreset({
            effects: effects.length > 0 ? effects : void 0,
        });
    };

    private updateCharacter() {
        const { activity, direction } = this.state;
        const { item } = this.props;

        const entity = this.entity;
        entity.set('activity', activity);
        entity.set('direction', direction);
        entity.set('view', this.props.createView(item));

        const { name, scale, effects } = item;

        entity.set('name', { value: name });
        if (isCreaturePreset(item)) {
            const { level, attitude } = item;

            entity.set('level', { value: level });
            set('attitude', attitude, (attitude) => ({ value: resolvePresetAttitude(attitude, false) }));
        }


        set('scale', scale, (scale) => ({ value: scale }));
        set('effects', effects, effects => effects);

        function set<K extends keyof ClientComponents, V>(key: K, value: V | undefined, transform: (value: V) => ClientComponents[K]) {
            if (value) {
                entity.set(key, transform(value));
            } else {
                entity.unset(key);
            }
        }

    }

    private containerRef = (div: HTMLElement | null) => {
        if (!div) {
            return;
        }
        div.appendChild(this.app.view);
    };

    private changeAnim = (event: React.SyntheticEvent<HTMLSelectElement>) => {
        this.setState({
            activity: event.currentTarget.value as Activity,
        });
    };
    private changeDir = (event: React.SyntheticEvent<HTMLSelectElement>) => {
        this.setState({
            direction: event.currentTarget.value as Direction,
        });
    };
}

function isCreaturePreset(preset: BasePreset): preset is CreaturePreset { // TODO not here
    return 'level' in preset;
}
