import { Diff } from '../../../common/protocol/Diff';

export class MapDiffUnpacker<K, V> {
    private map = new Map<K, V>();

    update(diffs: Diff<K, V>[]) {
        const newMap = new Map(this.map);

        for (const diff of diffs) {
            switch (diff.type) {
                case 'create':
                    newMap.set(diff.id, diff.data);
                    break;
                case 'change':
                    newMap.set(diff.id, { ...newMap.get(diff.id) as any, ...diff.changes as any });
                    break;
                case 'remove':
                    newMap.delete(diff.id);
            }
        }

        this.map = newMap;
    }

    public getCurrent(): Map<K, V> {
        return this.map;
    }
}
