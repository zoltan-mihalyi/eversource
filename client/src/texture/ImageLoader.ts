import { createTask } from '../Worker';
import { SplitBaseTexture } from './SplitTextureSource';

interface CreateBitmapParams {
    url: string;
    coordinates: [number, number][];
    width: number;
    height: number;
}

const createBitmaps = createTask<CreateBitmapParams, ImageBitmap[]>((data, cb) => {
    const { url, width, height, coordinates } = data;

    function fetchXhrBlob(url: string): Promise<Blob> {
        return new Promise<Blob>((resolve) => {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', url, true);
            xhr.responseType = 'blob';

            xhr.onload = () => {
                resolve(xhr.response);
            };

            xhr.send();
        });
    }

    fetchXhrBlob(url)
        .then(blob => coordinates.map(([x, y]) => createImageBitmap(blob, x, y, width, height)))
        .then(promises => Promise.all(promises))
        .then(bitmaps => cb(bitmaps, bitmaps));
});

function loadImagesNaive(src: string, splitWidth: number, splitHeight: number, baseTextures: SplitBaseTexture[]) {
    const img = document.createElement('img') as HTMLImageElement;
    img.src = src;
    img.onload = () => { // TODO destroy callback on end

        for (const baseTexture of baseTextures) {
            const { x, y } = baseTexture;

            const canvas = document.createElement('canvas') as HTMLCanvasElement;
            canvas.width = splitWidth;
            canvas.height = splitHeight;

            const ctx = canvas.getContext('2d')!;

            ctx.drawImage(img, x * splitWidth, y * splitHeight, splitWidth, splitHeight, 0, 0, splitWidth, splitHeight);
            baseTexture.loadLater(canvas);
        }
    };
}

function loadImagesWithWorker(src: string, splitWidth: number, splitHeight: number, baseTextures: SplitBaseTexture[]) {
    const params = {
        url: new URL(src, window.location.href).href,
        coordinates: baseTextures.map(({ x, y }) => [x * splitWidth, y * splitHeight] as [number, number]),
        width: splitWidth,
        height: splitHeight,
    };
    createBitmaps(params, (bitmaps) => {
        bitmaps.forEach((bitmap, i) => {
            (bitmap as any).getContext = true;
            baseTextures[i].loadLater(bitmap as any);
        });
    });
}

const webWorkerImageDecodingSupported = typeof Worker === 'function' && typeof createImageBitmap === 'function';

export const loadImages = webWorkerImageDecodingSupported ? loadImagesWithWorker : loadImagesNaive;