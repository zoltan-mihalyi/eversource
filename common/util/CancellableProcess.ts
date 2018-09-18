interface Callback<P1, P2> {
    (p1: P1, p2?: P2): void;
}

export class CancellableProcess {
    private aborted = false;

    run<P1, P2>(callback: Callback<P1, P2>): Callback<P1, P2> {
        return (p1: P1, p2?: P2) => {
            if (this.aborted) {
                return;
            }
            callback(p1, p2);
        }
    }

    promise<T>(executor: (resolve: (value?: T | PromiseLike<T>) => void, reject: (reason?: any) => void) => void): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            executor(this.run(resolve), this.run(reject));
        });
    }

    stop() {
        this.aborted = true;
    }
}