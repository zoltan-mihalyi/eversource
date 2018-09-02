export interface SafeCallback<T> {
    (error: {}): void;

    (error: null, result: T): void;
}