import * as React from 'react';
import { PalettesTool } from './palettes/PalettesTool';
import { MonsterPresetTool } from './presets/monsters/MonsterPresetTool';
import { HumanoidPresetsTool } from './presets/humanoids/HumanoidPresetsTool';
import { SpellsTool } from './spells/SpellsTool';
import { QuestsTool } from './quests/QuestsTool';
import { ObjectPresetTool } from './presets/objects/ObjectPresetTool';
import { ItemsTool } from './items/ItemsTool';
import { openFileDialog } from './Utils';
import { generateEquipmentImage } from './EquipmentImageGenerator';
import { MonsterTemplatesTool } from './templates/MonsterTemplatesTool';

interface State {
    screen: 'humanoids' | 'monsters' | 'objects' | 'monster-templates' | 'items' | 'spells' | 'quests' | 'palettes' | null;
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
                        <h2>Presets</h2>
                        <div>
                            <button className="big" onClick={this.showHumanoids}>Humanoids</button>
                            <button className="big" onClick={this.showMonsters}>Monsters</button>
                            <button className="big" onClick={this.showObjects}>Objects</button>
                        </div>
                        <h2>Templates</h2>
                            <button className="big" onClick={this.showMonsterTemplates}>Monster templates</button>
                        <h2>Others</h2>
                        <div>
                            <button className="big" onClick={this.showItems}>Items</button>
                            <button className="big" onClick={this.showQuests}>Quests</button>
                            <button className="big" onClick={this.showSpells}>Spells</button>
                        </div>
                        <div>
                            <button className="big" onClick={this.showPalettes}>Palettes</button>
                        </div>
                        <div>
                            <button className="big" onClick={this.generateEquipmentImage}>
                                Generate Equipment images
                            </button>
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
            case 'objects':
                return (
                    <ObjectPresetTool onExit={this.showMainMenu}/>
                );
            case 'monster-templates':
                return (
                    <MonsterTemplatesTool onExit={this.showMainMenu}/>
                );
            case 'items':
                return (
                    <ItemsTool onExit={this.showMainMenu}/>
                );
            case 'quests':
                return (
                    <QuestsTool onExit={this.showMainMenu}/>
                );
            case 'spells':
                return (
                    <SpellsTool onExit={this.showMainMenu}/>
                );
            case 'palettes':
                return (
                    <PalettesTool onExit={this.showMainMenu}/>
                );
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
    private showObjects = () => {
        this.setState({ screen: 'objects' });
    };
    private showMonsterTemplates = () => {
        this.setState({ screen: 'monster-templates' });
    };
    private showSpells = () => {
        this.setState({ screen: 'spells' });
    };
    private showItems = () => {
        this.setState({ screen: 'items' });
    };
    private showQuests = () => {
        this.setState({ screen: 'quests' });
    };
    private showPalettes = () => {
        this.setState({ screen: 'palettes' });
    };

    private generateEquipmentImage = () => {
        openFileDialog(generateEquipmentImage);
    };
}
