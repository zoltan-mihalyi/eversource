import * as React from 'react';
import { PresetsTool } from './presets/PresetsTool';
import { PalettesTool } from './palettes/PalettesTool';

interface State {
    screen: 'presets' | 'palettes' | null;
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
                        <div>
                            <button className="big" onClick={this.showPresets}>Presets</button>
                        </div>
                        <div>
                            <button className="big" onClick={this.showPalettes}>Palettes</button>
                        </div>
                    </div>
                );
            case 'presets':
                return (
                    <PresetsTool onExit={this.showMainMenu}/>
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

    private showPresets = () => {
        this.setState({ screen: 'presets' });
    };
    private showPalettes = () => {
        this.setState({ screen: 'palettes' });
    };
}