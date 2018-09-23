import * as React from 'react';
import * as path from 'path';
import * as PIXI from 'pixi.js';
import { Preset } from '../../../server/src/world/Presets';
import { PropTable } from './PropTable';
import { Character } from '../../../client/src/game/Character';
import { TextureLoader } from '../../../client/src/map/TextureLoader';
import { CancellableProcess } from '../../../common/util/CancellableProcess';
import { CharacterAnimation, Direction, GameObject } from '../../../common/GameObject';
import { X, Y } from '../../../common/domain/Location';
import { wwwDir } from '../Utils';

interface Props {
    name: string;
    originalPreset: Preset;
    save: (preset: Preset) => void;
    exit: () => void;
}

interface State {
    preset: Preset;
    animation: CharacterAnimation;
    direction: Direction;
}

const process = new CancellableProcess();
const textureLoader = new TextureLoader(process, 'file://' + path.join(wwwDir, 'spritesheets'));

export class ShowCharacter extends React.Component<Props, State> {
    private app: PIXI.Application;

    private onChangeAppearance = this.createOnChangeHandler('appearance');
    private onChangeEquipment = this.createOnChangeHandler('equipment');

    constructor(props: Props) {
        super(props);
        this.state = {
            animation: 'walking',
            direction: 'D',
            preset: props.originalPreset,
        };

        this.app = new PIXI.Application({ width: 128, height: 128 });
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
                    <select onChange={this.changeAnim} value={this.state.animation} size={3}>
                        <option value="standing">Standing</option>
                        <option value="walking">Walking</option>
                        <option value="casting">Casting</option>
                    </select>
                    <select onChange={this.changeDir} value={this.state.direction} size={4}>
                        <option value="L">Left</option>
                        <option value="U">Up</option>
                        <option value="R">Right</option>
                        <option value="D">Down</option>
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


        const { preset, animation, direction } = this.state;

        const gameObject: GameObject = {
            type: 'character',
            position: { x: 0 as X, y: 0 as Y },
            speed: 3,
            animation,
            appearance: preset.appearance,
            equipment: preset.equipment,
            direction,
        };

        const character = new Character(textureLoader, gameObject);
        character.x = 32;
        character.y = 32;
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
            animation: event.currentTarget.value as CharacterAnimation,
        });
    };
    private changeDir = (event: React.SyntheticEvent<HTMLSelectElement>) => {
        this.setState({
            direction: event.currentTarget.value as Direction,
        });
    };
}