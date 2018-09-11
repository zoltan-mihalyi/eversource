export interface StateConstructor<S extends State<C, T>, C, T> {
    new(manager: StateManager<S, C>, context: C, data: T): S
}

export abstract class State<C, T> {
    constructor(protected readonly manager: StateManager<any, C>, protected readonly context: C, protected readonly data: T) {
    }

    onEnter(): void {
    }
}

export class StateManager<S extends State<C, any>, C> {
    static create<S extends State<C, T>, C, T>(context: C, stateConstructor: StateConstructor<S, C, T>, data: T): StateManager<S, C> {
        return new StateManager<S, C>(context, stateConstructor, data);
    }

    private currentState: S;

    private constructor(private context: C, stateConstructor: StateConstructor<S, C, any>, data:any) {
        this.currentState = this.instantiateState(stateConstructor, data);
        this.currentState.onEnter();
    }

    enter<T>(stateConstructor: StateConstructor<S, C, T>, data: T) {
        this.currentState = this.instantiateState(stateConstructor, data);
        this.currentState.onEnter();
    }

    getCurrentState(): S {
        return this.currentState;
    }

    private instantiateState<T>(stateConstructor: StateConstructor<S, C, T>, data: T): S {
        return new stateConstructor(this, this.context, data);
    }
}