import { Position } from '../domain/Location';
import { CreatureAttitude, Direction, Effect } from '../domain/CreatureEntityData';
import { Appearance, Equipment } from '../domain/HumanoidEntityData';

interface Scale {
    readonly value: number;
}

interface Attitude {
    readonly value: CreatureAttitude;
}

interface WalkingActivity {
    readonly type: 'walking';
    readonly speed: number;
}

interface CastingActivity {
    readonly type: 'walking';
    readonly speed: number;
}

interface StandingActivity {
    readonly type: 'standing';
}

type Activity = WalkingActivity | CastingActivity | StandingActivity;


export interface BaseCreatureView {
    readonly activity: Activity;
    readonly direction: Direction;
}

export interface HumanoidView extends BaseCreatureView {
    readonly type: 'humanoid';
    readonly appearance: Appearance;
    readonly equipment: Equipment;
}

export interface SimpleView extends BaseCreatureView {
    readonly type: 'simple';
    readonly image: string;
    readonly palette: string | null;
}

type View = HumanoidView | SimpleView;

export interface Hp {
    readonly max: number;
    readonly current: number;
}

export interface Level {
    readonly value: number;
}

export interface Xp {
    readonly value: number;
}

interface Name {
    readonly value: string;
}

export interface CommonComponents {
    view: View;
    position: Position;
    name: Name;
    scale: Scale;
    attitude: Attitude;
    hp: Hp;
    level: Level;
    player: true,
    xp: Xp;
    effects: Effect[];
}
