import * as React from 'react';
import { Palette, Palettes } from '../../../client/src/game/Palettes';
import * as fs from 'fs';
import { openFileDialog, saveFileDialog } from '../Utils';
import * as path from 'path';

export interface Props {
    defaultFilename: string | null;
    close: () => void;
}

interface State {
    filename: string | null;
    palettes: Palettes | null;
}

const MAX_PALETTE_SIZE = 16;

const PaletteBoxes: React.SFC<{ palette: Palette }> = ({ palette }) => {
    return (
        <div>
            {palette.map((color, index) => (
                <div key={index} className="color" style={{ background: color }}/>
            ))}
        </div>
    );
};

const PaletteSizeWarning: React.SFC<{ size: number }> = ({ size }) => {
    if (size <= MAX_PALETTE_SIZE) {
        return null;
    }
    return (
        <p style={{ fontSize: 24, color: 'black', backgroundColor: 'red' }}>
            Palette size is <b>{size}</b> which is greater than {MAX_PALETTE_SIZE}!
        </p>
    );
};

export class PalettesEditor extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        const filename = props.defaultFilename;
        this.state = {
            filename,
            palettes: filename === null ? null : JSON.parse(fs.readFileSync(filename, 'utf-8')),
        };
    }

    render() {
        const { filename, palettes } = this.state;
        return (
            <div className="palettes">
                <button className="big" onClick={this.save}>Save</button>
                <button className="big exit" onClick={this.props.close}>X</button>
                <h1>{filename}</h1>
                {palettes === null ? (
                    <button className="big" onClick={this.setBase}>Set base</button>
                ) : (
                    <div>
                        <PaletteSizeWarning size={palettes.base.length}/>

                        <h3>Base</h3>
                        <PaletteBoxes palette={palettes.base.map(info => info.color)}/>
                        <button className="big" onClick={this.add}>+</button>
                        {Object.keys(palettes.variations).map(key => (
                            <div key={key}>
                                <button onClick={() => this.rename(key)}>Rename</button>
                                <button onClick={() => this.remove(key)}>X</button>
                                <h3>{key}</h3>
                                <br/>
                                <PaletteBoxes palette={palettes.variations[key]}/>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    }

    private add = () => {
        openFileDialog((file) => {
            loadImageToCanvasContext(file, this.readPaletteImage);
        });
    };

    private readPaletteImage = (image: HTMLImageElement, ctx: CanvasRenderingContext2D) => {
        const palettes = this.state.palettes!;

        const palette: Palette = [];
        for (const baseColorInfo of palettes.base) {
            const { coordinates } = baseColorInfo;
            const pixel = ctx.getImageData(coordinates[0], coordinates[1], 1, 1).data;
            const color = getColor(pixel, 0);
            palette.push(PIXI.utils.hex2string(color));
        }
        this.setState({
            palettes: {
                ...palettes,
                variations: {
                    ...palettes.variations,
                    [path.parse(image.src).name]: palette,
                },
            },
        })
    };

    private setBase = () => {
        openFileDialog((file) => {
            loadImageToCanvasContext(file, this.readBaseImage);
        });
    };

    private readBaseImage = (image: HTMLImageElement, ctx: CanvasRenderingContext2D) => {
        const imageData = ctx.getImageData(0, 0, image.width, image.height);
        const data = imageData.data;
        const colors: number[] = [];
        const colorCoordinates: [number, number][] = [];
        for (let i = 0; i < data.length; i += 4) {
            if (data[i + 3] === 0) {
                continue;
            }
            const color = getColor(data, i);
            if (colors.indexOf(color) === -1) {
                colors.push(color);
                colorCoordinates.push([i / 4 % image.width, Math.floor(i / 4 / image.width)]);
            }
        }
        const base = colors.map((color, index) => ({
            color: PIXI.utils.hex2string(color),
            coordinates: colorCoordinates[index],
        }));
        this.setState({
            palettes: {
                base,
                variations: {},
            },
        })
    };

    private rename(key: string) {
        const newName = prompt('New key', key);
        if (newName === key || !newName) {
            return;
        }
        const palettes = this.state.palettes!;
        const variations = palettes.variations;
        const newVariations = {} as Palettes['variations'];
        for (const paletteKey of Object.keys(variations)) {
            newVariations[key === paletteKey ? newName : paletteKey] = variations[paletteKey];
        }
        this.setState({
            palettes: {
                ...palettes,
                variations: newVariations,
            },
        });
    }

    private remove(key: string) {
        if (!confirm(`Remove ${key}?`)) {
            return;
        }
        const palettes = this.state.palettes!;
        const newVariations = { ...palettes.variations };
        delete newVariations[key];

        this.setState({
            palettes: {
                ...palettes,
                variations: newVariations,
            },
        });
    }

    private save = () => {
        saveFileDialog(this.state.filename, (file) => {
            fs.writeFileSync(file, JSON.stringify(this.state.palettes, null, 2));
            this.setState({
                filename: file,
            })
        });
    };
}

function loadImageToCanvasContext(file: string, callback: (image: HTMLImageElement, ctx: CanvasRenderingContext2D) => void) {
    const image = document.createElement('img') as HTMLImageElement;
    image.onload = () => {
        const canvas = document.createElement('canvas') as HTMLCanvasElement;
        canvas.width = image.width;
        canvas.height = image.height;
        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(image, 0, 0);

        callback(image, ctx);
    };
    image.src = file;

}

function getColor(data: Uint8ClampedArray, i: number) {
    return (data[i] * 256 + data[i + 1]) * 256 + data[i + 2];
}
