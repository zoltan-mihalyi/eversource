import { WrappedAudioNode } from './WrappedAudioNode';

const audioContext: AudioContext = new ((window as any).AudioContext || (window as any).webkitAudioContext)();

if (audioContext.state === 'suspended') {
    document.body.addEventListener('keydown', resumeAudio);
    document.body.addEventListener('click', resumeAudio);
}

function resumeAudio() {
    document.body.removeEventListener('keydown', resumeAudio);
    document.body.removeEventListener('click', resumeAudio);
    audioContext.resume();
}

function createChannel(directory: string): WrappedAudioNode<GainNode> {
    const channel = audioContext.createGain();
    channel.connect(master);
    return new WrappedAudioNode(audioContext, channel, directory);
}

const compress = audioContext.createDynamicsCompressor().connect(audioContext.destination);
const master = audioContext.createGain().connect(compress);

export const sfx = createChannel('sfx');
export const gui = createChannel('gui');
export const music = createChannel('music');
