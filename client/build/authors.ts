import * as fs from 'fs';
import * as marked from 'marked';

export function convert(content: Buffer, path: string): string | Buffer {
    const renderer = new marked.Renderer();
    renderer.link = (href, title, text) => `<a target="_blank" href="${href}" title="${title}">${text}</a>`;
    return marked(content.toString('utf-8'), { renderer });
}