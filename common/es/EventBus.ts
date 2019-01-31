type Callback = (payload: any) => void;

export class EventBus<T> {
    private listenerMap: { [type: string]: Callback[] } = {};

    on<K extends keyof T & string>(type: K, cb: (payload: T[K]) => void): void {
        const callbacks = this.listenerMap[type];

        if (callbacks) {
            callbacks.push(cb);
        } else {
            this.listenerMap[type] = [cb];
        }
    }

    emit<K extends keyof T & string>(type: K, payload: T[K]): void {
        const callbacks = this.listenerMap[type];

        if (!callbacks) {
            return;
        }

        for (const cb of callbacks) {
            cb(payload);
        }
    }
}
