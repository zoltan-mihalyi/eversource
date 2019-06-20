import { WrappedAudioNode } from './WrappedAudioNode';
import MusicPlayer from './MusicPlayer';

const audioContext: AudioContext = new ((window as any).AudioContext || (window as any).webkitAudioContext)();

const FOCUS_FADE_DURATION = 0.1;

if (audioContext.state === 'suspended') {
    document.body.addEventListener('keydown', resumeAudio);
    document.body.addEventListener('click', resumeAudio);
} else {
    setTimeout(startThemeMusic);
}

function resumeAudio() {
    document.body.removeEventListener('keydown', resumeAudio);
    document.body.removeEventListener('click', resumeAudio);
    audioContext.resume().then(startThemeMusic);
}

function handleFocus() {
    const newValue = document.hidden ? 0 : 1;
    master.gain.linearRampToValueAtTime(newValue, audioContext.currentTime + FOCUS_FADE_DURATION);
}

export function startThemeMusic() {
    musicPlayer.playMusic('heroic-minority');
}

function createChannel(directory: string): WrappedAudioNode<GainNode> {
    const channel = audioContext.createGain();
    channel.connect(master);
    return new WrappedAudioNode(audioContext, channel, directory);
}

const factor = 10;

function toExponential(n: number) {
    return (Math.pow(factor, n) - 1) / (factor - 1);
}

const compress = audioContext.createDynamicsCompressor().connect(audioContext.destination);
const master = audioContext.createGain();
master.connect(compress);

export const sfx = createChannel('sfx');
export const gui = createChannel('gui');
export const music = createChannel('music');
music.audioNode.gain.value = toExponential(0.5);


export const musicPlayer = new MusicPlayer(music);

document.addEventListener('visibilitychange', handleFocus);
handleFocus();
