export type NonEmptyArray<T> = T[] & [T];

export type PartialPick<T, K extends keyof T> = Readonly<Partial<T> & Pick<T, K>>;

export type Nullable<T> = {
    [P in keyof T]: T[P] | null;
};

export type Writable<T> = {
    -readonly [P in keyof T]: T[P];
};
