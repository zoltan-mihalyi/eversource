import { WrappedAudioNode } from './WrappedAudioNode';

const FADE_DURATION = 2;

export default class MusicPlayer {
    private currentMusicNode: WrappedAudioNode<GainNode> | null = null;

    constructor(private readonly node: WrappedAudioNode<GainNode>) {
    }

    playMusic(name: string) {
        const currentTime = this.node.context.currentTime;

        const currentMusicNode = this.currentMusicNode;
        if (currentMusicNode) {
            currentMusicNode.audioNode.gain.linearRampToValueAtTime(0, currentTime + FADE_DURATION);
            setTimeout(() => {
                currentMusicNode.audioNode.disconnect();
            }, (FADE_DURATION + 1) * 1000)
        }

        const newMusicNode = this.node.createGain();
        newMusicNode.audioNode.gain.value = 0;
        newMusicNode.audioNode.gain.linearRampToValueAtTime(1, currentTime + FADE_DURATION);
        newMusicNode.playSound(name, { loop: true });
        this.currentMusicNode = newMusicNode;
    }
}