export type PartialPick<T, K extends keyof T> = Readonly<Partial<T> & Pick<T, K>>;

export type Writable<T> = {
    -readonly [P in keyof T]: T[P];
}