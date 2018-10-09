import { TextureLoader } from '../map/TextureLoader';
import { UpdatableDisplay } from '../display/UpdatableDisplay';

export interface GameContext {
    textureLoader: TextureLoader;

    onInteract(display: UpdatableDisplay<any>): void;
}