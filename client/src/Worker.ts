export type Transferable = ArrayBuffer | ImageBitmap;

type WorkerTask<T, R> = (data: T, cb: (resp: R, transfer?: Transferable[]) => void) => void;
type WindowTask<T, R> = (data: T, cb: (resp: R) => void) => void;


export function createTask<T, R>(task: WorkerTask<T, R>): WindowTask<T, R> {
    const script = [
        `const task = ${task};`,
        `self.onmessage = (e) => {`,
        `    task(e.data[1], (resp, transfer) => {`,
        `        postMessage([e.data[0], resp], transfer)`,
        `    });`,
        `};`,
    ].join('\n');

    const blob = new Blob([script], { type: 'application/javascript' });

    const callbacks = new Map<number, (resp: any) => void>();

    const worker = new Worker(URL.createObjectURL(blob));
    worker.onmessage = (msg) => {
        const [id, data] = msg.data;
        const cb = callbacks.get(id);
        if (cb) {
            callbacks.delete(id);
            cb(data);
        }
    };

    let nextId = 0;
    return function (data: T, cb: (resp: R) => void) {
        const id = ++nextId;
        callbacks.set(id, cb);

        worker.postMessage([id, data]);
    }
}