import * as PIXI from 'pixi.js';

type Callback<T> = (data: T) => void;

export interface Request {
    stop(): void;
}

export abstract class AsyncLoader<T> {
    private loaded = new Map<string, T>();
    private loading = new Map<string, Set<Callback<T>>>();

    getForContainer(container: PIXI.Container, key: string, cb: Callback<T>) {
        const request = this.get(key, cb);
        container.on('removed', () => request.stop());
    }

    get(key: string, cb: Callback<T>): Request {
        const data = this.loaded.get(key);
        const request: Request = {
            stop: () => {
                const loading = this.loading.get(key);
                if (loading) {
                    loading.delete(cb);
                }
            },
        };
        if (data) {
            cb(data);
            return request;
        }

        let callbacks = this.loading.get(key);
        if (callbacks) {
            callbacks.add(cb);
            return request;
        }

        callbacks = new Set<Callback<T>>([cb]);
        this.loading.set(key, callbacks);
        this.load(key, (data: T) => {
            this.loaded.set(key, data);
            this.loading.delete(key);

            callbacks!.forEach(callback => callback(data));
        });

        return request;
    }


    protected abstract load(key: string, cb: Callback<T>): void;
}