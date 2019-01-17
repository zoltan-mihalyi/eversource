import * as React from 'react';
import * as path from 'path';
import * as PIXI from '../../../client/src/pixi';
import { TextureLoader } from '../../../client/src/map/TextureLoader';
import { CancellableProcess } from '../../../common/util/CancellableProcess';
import { wwwDir } from '../Utils';
import { BaseCreatureEntityData, CreatureActivity, Direction, Effect } from '../../../common/domain/CreatureEntityData';
import { GameContext } from '../../../client/src/game/GameContext';
import { BasePreset, PresetAttitude, resolvePresetAttitude } from '../../../server/src/world/Presets';
import { UpdatableDisplay } from '../../../client/src/display/UpdatableDisplay';
import { X, Y } from '../../../common/domain/Location';
import { EffectEdit } from './EffectEdit';

PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

export interface EditProps<T> {
    preset: T;
    onChange: (update: Partial<T>) => void;
}

export type createDisplay<T> = (baseEntityData: BaseCreatureEntityData, preset: T, context: GameContext) => UpdatableDisplay<any>;

interface Props<T> {
    name: string;
    canCast: boolean;
    originalPreset: T;
    Edit: React.ComponentType<EditProps<T>>;
    createDisplay: createDisplay<T>;
    save: (preset: T) => void;
    exit: () => void;
}

interface State<T> {
    preset: T;
    activity: CreatureActivity;
    direction: Direction;
}

const process = new CancellableProcess();

const SCALE = 4;
const CANVAS_WIDTH = 192 * SCALE;

export class ShowPreset<T extends BasePreset> extends React.Component<Props<T>, State<T>> {
    private app: PIXI.Application;
    private container = new PIXI.Container();
    private gameContext: GameContext;

    constructor(props: Props<T>) {
        super(props);
        this.state = {
            activity: 'walking',
            direction: 'down',
            preset: props.originalPreset,
        };

        this.app = new PIXI.Application({
            width: CANVAS_WIDTH,
            height: CANVAS_WIDTH * 0.75,
            backgroundColor: 0x2e8036,
        });
        this.container.scale.set(SCALE);
        this.app.stage.addChild(this.container);

        const basePath = 'file://' + path.join(wwwDir, 'spritesheets');
        this.gameContext = {
            textureLoader: new TextureLoader(this.app.renderer, process, 32, basePath),
            playingNetworkApi: {
                interact: () => {
                },
            },
        };
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
                        <span className="prop-name">level </span>
                        <input className="small-input" value={preset.level} type="number" min="1" step="1" onChange={this.changeLevel}/>
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
        this.container.removeChildren();

        const { preset, activity, direction } = this.state;

        const baseEntityData: BaseCreatureEntityData = {
            level: 1,
            hp: 100,
            maxHp: 100,
            player: false,
            scale: preset.scale || 1,
            attitude: resolvePresetAttitude(preset.attitude, false),
            interaction: ['quest'],
            position: { x: 0 as X, y: 0 as Y },
            activity,
            activitySpeed: 3,
            name: preset.name,
            direction,
            effects: preset.effects || [],
        };

        const character = this.props.createDisplay(baseEntityData, preset, this.gameContext);

        character.init();
        character.x = CANVAS_WIDTH / SCALE / 2;
        character.y = 122;
        this.container.addChild(character);
    }

    private containerRef = (div: HTMLElement | null) => {
        if (!div) {
            return;
        }
        div.appendChild(this.app.view);
    };

    private changeAnim = (event: React.SyntheticEvent<HTMLSelectElement>) => {
        this.setState({
            activity: event.currentTarget.value as CreatureActivity,
        });
    };
    private changeDir = (event: React.SyntheticEvent<HTMLSelectElement>) => {
        this.setState({
            direction: event.currentTarget.value as Direction,
        });
    };
}