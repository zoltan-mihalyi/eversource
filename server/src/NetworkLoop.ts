type Listener = () => void;

export class NetworkLoop {
    private timer: any = null;
    private listeners = new Set<Listener>();

    start() {
        if (this.timer !== null) {
            throw new Error('Already started!');
        }
        setInterval(this.update, 50);
    }

    stop() {
        if (this.timer === null) {
            throw new Error('Not running!');
        }
        clearInterval(this.timer);
        this.timer = null;
    }

    add(listener: Listener) {
        this.listeners.add(listener);
        listener();
    }

    remove(listener: Listener) {
        this.listeners.delete(listener);
    }

    private update = () => {
        this.listeners.forEach(listener => listener());
    }
}