type Grouped<T> = {
    [key: string]: T[] | undefined
}

export function groupBy<T extends { [P in K]: string }, K extends keyof T>(array: T[], property: K): Grouped<T> {
    const result: Grouped<T> = {};
    for (const item of array) {
        const key = item[property];
        const itemsForKey = result[key];
        if (itemsForKey) {
            itemsForKey.push(item);
        } else {
            result[key] = [item];
        }
    }
    return result;
}


