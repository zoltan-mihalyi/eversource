import { TextureLoader } from '../map/TextureLoader';
import { PlayingNetworkApi } from '../protocol/PlayingState';

type Interactable = Pick<PlayingNetworkApi, 'interact'>

export interface GameContext {
    textureLoader: TextureLoader;
    playingNetworkApi: Interactable;
}