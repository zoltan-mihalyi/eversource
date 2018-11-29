/**
 * Ensures that a limited amount of tasks run in a frame by enqueueing them
 */

export class TaskQueue {
    private queue: (() => void)[] = [];
    private itemsProcessedInFrame = 0;
    private rafId: number | null = null;

    constructor(private tasksPerFrame: number) {
    }

    enqueue(task: () => void) {
        if (this.itemsProcessedInFrame >= this.tasksPerFrame) {
            this.queue.push(task);
        } else {
            this.processTask(task);
            if (!this.rafId) {
                this.rafId = requestAnimationFrame(this.processQueue);
            }
        }
    }

    private processTask(task: () => void) {
        this.itemsProcessedInFrame++;
        task();
    }

    private processQueue = () => {
        this.itemsProcessedInFrame = 0;

        if (this.queue.length !== 0) {
            this.rafId = requestAnimationFrame(this.processQueue);
        } else {
            this.rafId = null;
        }

        for (let i = 0; i < this.tasksPerFrame; i++) {
            const task = this.queue.shift();
            if (!task) {
                break;
            }
            this.processTask(task);
        }
    };
}