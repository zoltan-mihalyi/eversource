interface PlaySoundOptions {
    volume?: number;
    destroyOnEnd?: WrappedAudioNode<AudioNode>;
}

export class WrappedAudioNode<T extends AudioNode> {
    constructor(protected readonly context: AudioContext, protected readonly audioNode: T, protected readonly directory: string) {
    }

    playSound(name: string, options: PlaySoundOptions = {}) {
        const { volume = 100, destroyOnEnd } = options;

        const audio = document.createElement('audio');
        audio.src = `audio/${this.directory}/${name}.mp3`;

        const effectVolume = this.context.createGain();
        effectVolume.gain.value = volume / 100;
        effectVolume.connect(this.audioNode);

        const sourceNode = this.context.createMediaElementSource(audio);
        sourceNode.connect(effectVolume);

        audio.play();
        audio.onended = () => {
            const destroyNode = destroyOnEnd ? destroyOnEnd.audioNode : effectVolume;
            destroyNode.disconnect();
        };
        return audio;
    }

    createPanner(maxDistance: number, refDistance: number, coneInnerAngle: number, coneOuterAngle: number): WrappedPannerNode {
        const panner = this.context.createPanner();

        panner.panningModel = 'HRTF';
        panner.distanceModel = 'linear';
        panner.maxDistance = maxDistance;
        panner.refDistance = refDistance;
        panner.coneInnerAngle = coneInnerAngle;
        panner.coneOuterAngle = coneOuterAngle;

        panner.connect(this.audioNode);
        return new WrappedPannerNode(this.context, panner, this.directory);
    }
}

class WrappedPannerNode extends WrappedAudioNode<PannerNode> {
    updatePosition(x: number, y: number, z: number) {
        const panner = this.audioNode;
        if (panner.positionX) {
            panner.positionX.value = x;
            panner.positionY.value = y;
            panner.positionZ.value = z;
        } else {
            panner.setPosition(x, y, z);
        }
    }
}