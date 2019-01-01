interface Settings {
    username: string | null;
    debug: boolean | null;
}

class SettingsStore {
    get<K extends keyof Settings>(key: K): Settings[K] {
        const item = localStorage.getItem(`settings.${key}`);
        if (item === null) {
            return item;
        }
        return JSON.parse(item);
    }

    set<K extends keyof Settings>(key: K, value: Settings[K]) {
        localStorage.setItem(`settings.${key}`, JSON.stringify(value));
    }
}

export const settings = new SettingsStore();