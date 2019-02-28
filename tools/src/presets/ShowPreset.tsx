import * as React from 'react';
import * as path from 'path';
import * as PIXI from '../../../client/src/pixi';
import { TextureLoader } from '../../../client/src/map/TextureLoader';
import { CancellableProcess } from '../../../common/util/CancellableProcess';
import { wwwDir } from '../Utils';
import { BasePreset, PresetAttitude, resolvePresetAttitude } from '../../../server/src/world/Presets';
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

export interface EditProps<T> {
    preset: T;
    onChange: (update: Partial<T>) => void;
}

export type createView<T> = (preset: T) => View;

interface Props<T> {
    name: string;
    canCast: boolean;
    originalPreset: T;
    Edit: React.ComponentType<EditProps<T>>;
    createView: createView<T>;
    save: (preset: T) => void;
    exit: () => void;
}

interface State<T> {
    preset: T;
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

export class ShowPreset<T extends BasePreset> extends React.Component<Props<T>, State<T>> {
    private app: PIXI.Application;
    private container = new PIXI.Container();
    private entity: Entity<ClientComponents>;

    constructor(props: Props<T>) {
        super(props);
        this.state = {
            activity: 'walking',
            direction: 'down',
            preset: props.originalPreset,
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
        const { preset } = this.state;
        const { canCast, Edit } = this.props;

        return (
            <div>
                <button className="big" onClick={this.save}>Save</button>
                <button className="big" onClick={this.props.exit}>Exit</button>
                <h1 className="character-name">{this.props.name}</h1>
                <div className="config">
                    <div>
                        <span className="prop-name">name </span>
                        <input value={preset.name} onChange={this.changeName}/>
                        <span className="prop-name">story </span>
                        <input value={preset.story} onChange={this.changeStory}/>
                        <span className="prop-name">level </span>
                        <input className="small-input" value={preset.level} type="number" min="1" step="1"
                               onChange={this.changeLevel}/>
                        {' '}
                        <select value={preset.attitude} onChange={this.changeAttitude}>
                            <option value="friendly">Friendly</option>
                            <option value="neutral">Neutral</option>
                            <option value="hostile">Hostile</option>
                        </select>
                        <span className="prop-name">scale </span>
                        <input className="small-input" type="number" value={preset.scale || 1} step={0.01} min={0.01}
                               onChange={this.changeScale}/>
                    </div>
                    <Edit preset={preset} onChange={this.onChange}/>

                    <div className="prop-table">
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
                            {preset.effects && preset.effects.map(((effect, i) => (
                                <EffectEdit key={i} index={i} effect={effect} onChange={this.changeEffect}
                                            onRemove={this.removeEffect}/>
                            )))}
                            <button onClick={this.addEffect}>+</button>
                        </div>
                    </div>
                </div>
                <div className="display" ref={this.containerRef}/>
            </div>
        );
    }

    private changePreset(newValues: Partial<BasePreset>) {
        this.setState({
            preset: {
                ...this.state.preset as any,
                ...newValues as any,
            },
        });
    }

    private save = () => {
        this.props.save(this.state.preset);
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

    private changeLevel = (e: React.SyntheticEvent<HTMLInputElement>) => {
        this.changePreset({
            level: +e.currentTarget.value,
        });
    };

    private changeAttitude = (e: React.SyntheticEvent<HTMLSelectElement>) => {
        this.changePreset({
            attitude: e.currentTarget.value as PresetAttitude,
        });
    };
    private changeScale = (e: React.SyntheticEvent<HTMLInputElement>) => {
        this.changePreset({
            scale: +e.currentTarget.value || 1,
        });
    };

    private changeEffect = (index: number, effect: Effect) => {
        const effects = this.state.preset.effects!.slice();
        effects[index] = effect;

        this.changePreset({ effects });
    };

    private addEffect = () => {
        const effects: Effect[] = [...this.state.preset.effects || [], { type: 'alpha', param: 1 }];

        this.changePreset({ effects });
    };

    private removeEffect = (index: number) => {
        const effects = this.state.preset.effects!.slice();
        effects.splice(index, 1);

        this.changePreset({
            effects: effects.length > 0 ? effects : void 0,
        });
    };

    private onChange = (update: Partial<T>) => {
        this.setState({
            preset: {
                ...this.state.preset as any,
                ...update as any,
            },
        });
    };

    private updateCharacter() {
        const { preset, activity, direction } = this.state;

        const entity = this.entity;
        entity.set('activity', activity);
        entity.set('direction', direction);
        entity.set('view', this.props.createView(preset));

        const { name, level, attitude, scale, effects } = preset;

        entity.set('name', { value: name });
        entity.set('level', { value: level });

        set('attitude', attitude, (attitude) => ({ value: resolvePresetAttitude(attitude, false) }));
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
