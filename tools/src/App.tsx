import * as React from 'react';
import { PalettesTool } from './palettes/PalettesTool';
import { MonsterPresetTool } from './presets/monsters/MonsterPresetTool';
import { HumanoidPresetsTool } from './presets/humanoids/HumanoidPresetsTool';

interface State {
    screen: 'humanoids' | 'monsters' | 'palettes' | null;
}

export class App extends React.Component<{}, State> {
    constructor(props: {}) {
        super(props);
        this.state = {
            screen: null,
        }
    }

    render() {

        switch (this.state.screen) {
            case null:
                return (
                    <div>
                        <header>Eversource Tools</header>
                        <div>
                            <button className="big" onClick={this.showHumanoids}>Humanoids</button>
                        </div>
                        <div>
                            <button className="big" onClick={this.showMonsters}>Monsters</button>
                        </div>
                        <div>
                            <button className="big" onClick={this.showPalettes}>Palettes</button>
                        </div>
                    </div>
                );
            case 'humanoids':
                return (
                    <HumanoidPresetsTool onExit={this.showMainMenu}/>
                );
            case 'monsters':
                return (
                    <MonsterPresetTool onExit={this.showMainMenu}/>
                );
            case 'palettes':
                return (
                    <PalettesTool onExit={this.showMainMenu}/>
                )
        }
    }

    private showMainMenu = () => {
        this.setState({ screen: null });
    };

    private showHumanoids = () => {
        this.setState({ screen: 'humanoids' });
    };
    private showMonsters = () => {
        this.setState({ screen: 'monsters' });
    };
    private showPalettes = () => {
        this.setState({ screen: 'palettes' });
    };
}