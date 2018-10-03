import * as React from 'react';
import * as path from 'path';
import * as PIXI from 'pixi.js';
import { Preset } from '../../../server/src/world/Presets';
import { PropTable } from './PropTable';
import { TextureLoader } from '../../../client/src/map/TextureLoader';
import { CancellableProcess } from '../../../common/util/CancellableProcess';
import { X, Y } from '../../../common/domain/Location';
import { wwwDir } from '../Utils';
import { CreatureActivity, Direction } from '../../../common/domain/CreatureEntityData';
import { HumanoidEntityData } from '../../../common/domain/HumanoidEntityData';
import { HumanoidDisplay } from '../../../client/src/display/HumanoidDisplay';

interface Props {
    name: string;
    originalPreset: Preset;
    save: (preset: Preset) => void;
    exit: () => void;
}

interface State {
    preset: Preset;
    activity: CreatureActivity;
    direction: Direction;
}

const process = new CancellableProcess();
const textureLoader = new TextureLoader(process, 32, 'file://' + path.join(wwwDir, 'spritesheets'));

export class ShowCharacter extends React.Component<Props, State> {
    private app: PIXI.Application;

    private onChangeAppearance = this.createOnChangeHandler('appearance');
    private onChangeEquipment = this.createOnChangeHandler('equipment');

    constructor(props: Props) {
        super(props);
        this.state = {
            activity: 'walking',
            direction: 'down',
            preset: props.originalPreset,
        };

        this.app = new PIXI.Application({ width: 128, height: 128, backgroundColor: 0xffffff });
        this.updateCharacter();
    }

    componentDidUpdate() {
        this.updateCharacter();
    }

    render() {
        const { preset } = this.state;

        return (
            <div>
                <button className="big" onClick={this.save}>Save</button>
                <button className="big" onClick={this.props.exit}>Exit</button>
                <h1 className="character-name">{this.props.name}</h1>
                <div className="config">
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

    private createOnChangeHandler<K extends keyof Preset>(key: K) {
        return (value: Preset[K]) => {
            this.setState({
                preset: {
                    ...this.state.preset,
                    [key]: value,
                },
            });
        };
    }

    private updateCharacter() {

        this.app.stage.removeChildren();


        const { preset, activity, direction } = this.state;

        const entityData: HumanoidEntityData = {
            type: 'creature',
            kind: 'humanoid',
            level: 1,
            hp: 100,
            maxHp: 100,
            player: false,
            interaction: [],
            position: { x: 0 as X, y: 0 as Y },
            activity,
            activitySpeed: 3,
            appearance: preset.appearance,
            equipment: preset.equipment,
            direction,
        };

        const character = new HumanoidDisplay(textureLoader, entityData);
        character.x = 48;
        character.y = 64;
        this.app.stage.addChild(character);
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