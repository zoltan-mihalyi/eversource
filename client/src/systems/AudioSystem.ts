import { EventBus } from '../../../common/es/EventBus';
import { ClientEvents } from '../es/ClientEvents';
import { EntityContainer } from '../../../common/es/EntityContainer';
import { ClientComponents } from '../es/ClientComponents';
import { CameraPosition } from './CameraFollowSystem';

export const audioContext: AudioContext = new ((window as any).AudioContext || (window as any).webkitAudioContext)();

if (audioContext.state === 'suspended') {
    document.body.addEventListener('keydown', resumeAudio);
    document.body.addEventListener('click', resumeAudio);
}

function resumeAudio() {
    document.body.removeEventListener('keydown', resumeAudio);
    document.body.removeEventListener('click', resumeAudio);
    audioContext.resume();
}

const compress = audioContext.createDynamicsCompressor();
compress.connect(audioContext.destination);

export const master = audioContext.createGain();
master.connect(compress);

export const music = audioContext.createGain();
music.connect(master);

export const sfx = audioContext.createGain();
sfx.connect(master);

export const gui = audioContext.createGain();
gui.connect(master);

export function audioSystem(container: EntityContainer<ClientComponents>, eventBus: EventBus<ClientEvents>,
                            cameraPosition: CameraPosition) {

    eventBus.on('soundEffectAction', ({ name, entityId, volume }) => {
        const panner = audioContext.createPanner();
        panner.panningModel = 'HRTF';
        panner.distanceModel = 'linear';
        panner.maxDistance = 13;
        panner.refDistance = 8;
        panner.coneInnerAngle = 360;
        panner.coneOuterAngle = 0;

        panner.connect(sfx);

        const entity = container.getEntity(entityId);

        const updatePannerPosition = () => {
            if (!entity) {
                return;
            }

            const { position } = entity.components;
            if (!position) {
                return;
            }
            updatePosition(panner, position.x - cameraPosition.position.x, position.y - cameraPosition.position.y, 4);
        };
        updatePannerPosition();

        const audio = playSoundEffect(name, panner, volume);
        audio.ontimeupdate = updatePannerPosition;
    });
}

export function playSoundEffect(name: string, target: AudioNode = sfx, volume: number = 100): HTMLAudioElement {
    const audio = document.createElement('audio');
    audio.src = `audio/sfx/${name}.mp3`;

    const effectVolume = audioContext.createGain();
    effectVolume.gain.value = volume / 100;
    effectVolume.connect(target);

    const sourceNode = audioContext.createMediaElementSource(audio);
    sourceNode.connect(effectVolume);

    const randomFactor = 0.2;
    audio.playbackRate = Math.pow(1 + randomFactor, Math.random() * 2 - 1);
    audio.play();
    audio.onended = () => {
        effectVolume.disconnect();
    };
    return audio;
}

function updatePosition(panner: PannerNode, x: number, y: number, z: number) {
    if (panner.positionX) {
        panner.positionX.value = x;
        panner.positionY.value = y;
        panner.positionZ.value = z;
    } else {
        panner.setPosition(x, y, z);
    }
}