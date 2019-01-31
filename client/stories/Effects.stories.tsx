import { storiesOf } from '@storybook/react';
import * as React from 'react';
import { MonsterDisplay } from '../src/display/MonsterDisplay';
import { CreatureAttitude, Effect } from '../../common/domain/CreatureEntityData';
import { MonsterEntityData } from '../../common/domain/MonsterEntityData';
import { X, Y } from '../../common/domain/Location';
import { GameContext } from '../src/game/GameContext';
import { TextureLoader } from '../src/map/TextureLoader';
import { CancellableProcess } from '../../common/util/CancellableProcess';
import { app, TestScreen } from './TestScreen';
import { EntityId } from '../../common/es/Entity';

const context: GameContext = {
    playingNetworkApi: {
        interact(id: EntityId): void {
        },
    },
    textureLoader: new TextureLoader(app.renderer, new CancellableProcess(), 32),
};

function createEffectDemo(...effects: Effect[]): React.ReactElement<any> {

    const entityData: MonsterEntityData = {
        type: 'monster',
        name: 'Test',
        position: {
            x: 0 as X,
            y: 0 as Y,
        },
        attitude: CreatureAttitude.HOSTILE,
        effects,
        activity: 'walking',
        activitySpeed: 3,
        direction: 'right',
        hp: 100,
        maxHp: 100,
        image: 'spider01',
        interaction: null,
        level: 10,
        palette: null,
        player: false,
        scale: 1,
    };

    const display = new MonsterDisplay(0 as EntityId, context, entityData, false);
    display.init();

    return (
        <TestScreen display={display} backgroundColor={0xffcc88}/>
    );
}

storiesOf('Effects', module)
    .add('speed', () => createEffectDemo({ type: 'speed', param: 2 }))
    .add('alpha', () => createEffectDemo({ type: 'alpha', param: 0.5 }))
    .add('fire', () => createEffectDemo({ type: 'fire', param: 1 }))
    .add('ice', () => createEffectDemo({ type: 'ice', param: 1 }))
    .add('poison', () => createEffectDemo({ type: 'poison', param: 1 }))
    .add('stone', () => createEffectDemo({ type: 'stone', param: 1 }))
    .add('light', () => createEffectDemo({ type: 'light', param: 1 }))
    .add('multiple', () => createEffectDemo(
        { type: 'speed', param: 2 },
        { type: 'alpha', param: 0.5 },
        { type: 'fire', param: 1 }),
    )
    .add('multiple color', () => createEffectDemo({ type: 'poison', param: 1 },{ type: 'ice', param: 1 }))


