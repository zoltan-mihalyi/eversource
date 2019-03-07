import { convertMap } from './map-converter';

export function convert(content: Buffer, path: string): string | Buffer {
    if (!path.endsWith('.json')) {
        return content;
    }
    const json = JSON.parse(content.toString('utf-8'));
    if (json.type !== 'map') {
        return content;
    }
    console.log(`Converting ${path}`);
    return convertMap(path, json, 'terrain-map-v7.json', 'terrain-v7.json');
}