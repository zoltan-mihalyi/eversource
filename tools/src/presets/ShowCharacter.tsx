import * as React from 'react';
import * as path from 'path';
import * as PIXI from '../../../client/src/pixi';
import { HumanoidPreset, PresetAttitude, resolvePresetAttitude } from '../../../server/src/world/Presets';
import { PropTable } from './PropTable';
import { TextureLoader } from '../../../client/src/map/TextureLoader';
import { CancellableProcess } from '../../../common/util/CancellableProcess';
import { X, Y } from '../../../common/domain/Location';
import { wwwDir } from '../Utils';
import { CreatureActivity, Direction } from '../../../common/domain/CreatureEntityData';
import { HumanoidEntityData } from '../../../common/domain/HumanoidEntityData';
import { HumanoidDisplay } from '../../../client/src/display/HumanoidDisplay';
import { GameContext } from '../../../client/src/game/GameContext';
import { EntityId } from '../../../common/domain/EntityData';

PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

interface Props {
    name: string;
    originalPreset: HumanoidPreset;
    save: (preset: HumanoidPreset) => void;
    exit: () => void;
}

interface State {
    preset: HumanoidPreset;
    activity: CreatureActivity;
    direction: Direction;
}

const process = new CancellableProcess();

const SCALE = 4;
const CANVAS_WIDTH = 192 * SCALE;

export class ShowCharacter extends React.Component<Props, State> {
    private app: PIXI.Application;
    private container = new PIXI.Container();
    private gameContext: GameContext;

    private onChangeAppearance = this.createOnChangeHandler('appearance');
    private onChangeEquipment = this.createOnChangeHandler('equipment');

    constructor(props: Props) {
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

        return (
            <div>
                <button className="big" onClick={this.save}>Save</button>
                <button className="big" onClick={this.props.exit}>Exit</button>
                <h1 className="character-name">{this.props.name}</h1>
                <div className="config">
                    <div>
                        <span className="prop-name">name </span>
                        <input value={preset.name} onChange={this.changeName}/>
                        {' '}
                        <select value={preset.attitude} onChange={this.changeAttitude}>
                            <option value="friendly">Friendly</option>
                            <option value="neutral">Neutral</option>
                            <option value="hostile">Hostile</option>
                        </select>
                        <span className="prop-name">scale </span>
                        <input type="number" value={preset.scale || 1} step={0.01} min={0.01}
                               onChange={this.changeScale}/>
                    </div>
                    <PropTable data={preset.appearance as {}} onChange={this.onChangeAppearance}/>
                    <PropTable data={preset.equipment as {}} onChange={this.onChangeEquipment}/>
                    <select onChange={this.changeAnim} value={this.state.activity} size={3}>
                        <option value="standing">Standing</option>
                        <option value="walking">Walking</option>
                        <option value="casting">Casting</option>
                    </select>
                    <select onChange={this.changeDir} value={this.state.direction} size={4}>
                        <option value="left">Left</option>
                        <option value="up">Up</option>
                        <option value="right">Right</option>
                        <option value="down">Down</option>
                    </select>
                </div>
                <div className="display" ref={this.containerRef}/>
            </div>
        );
    }

    private save = () => {
        this.props.save(this.state.preset);
    };

    private changeName = (e: React.SyntheticEvent<HTMLInputElement>) => {
        this.setState({
            preset: {
                ...this.state.preset,
                name: e.currentTarget.value,
            },
        });
    };

    private changeAttitude = (e: React.SyntheticEvent<HTMLSelectElement>) => {
        this.setState({
            preset: {
                ...this.state.preset,
                attitude: e.currentTarget.value as PresetAttitude,
            },
        });
    };
    private changeScale = (e: React.SyntheticEvent<HTMLInputElement>) => {
        this.setState({
            preset: {
                ...this.state.preset,
                scale: +e.currentTarget.value || 1,
            },
        });
    };

    private createOnChangeHandler<K extends keyof HumanoidPreset>(key: K) {
        return (value: HumanoidPreset[K]) => {
            this.setState({
                preset: {
                    ...this.state.preset,
                    [key]: value,
                },
            });
        };
    }

    private updateCharacter() {
        this.container.removeChildren();

        const { preset, activity, direction } = this.state;

        const entityData: HumanoidEntityData = {
            type: 'humanoid',
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
            appearance: preset.appearance,
            equipment: preset.equipment,
            direction,
        };

        const character = new HumanoidDisplay(0 as EntityId, this.gameContext, entityData, false);
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