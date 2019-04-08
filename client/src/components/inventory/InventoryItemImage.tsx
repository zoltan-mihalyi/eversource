import * as React from 'react';
import { Texture } from 'pixi.js';
import { DomTexture } from '../DomTexture';
import { Request } from '../../loader/AsyncLoader';
import { TextureLoader } from '../../loader/TextureLoader';
import TextureLoaderContext from '../context/TextureLoaderContext';
import { ItemInfo } from '../../../../common/protocol/ItemInfo';

interface Props {
    itemInfo: ItemInfo;
}

interface InnerProps extends Props {
    textureLoader: TextureLoader;
}

interface State {
    texture: Texture | null;
}

export class RawInventoryItemImage extends React.PureComponent<InnerProps, State> {
    private request: Request | null = null;

    constructor(props: InnerProps) {
        super(props);
        this.state = { texture: null };
    }

    render() {
        const { texture } = this.state;

        if (!texture) {
            return null;
        }

        return (
            <DomTexture texture={texture}/>
        );
    }

    componentDidUpdate() {
        this.startRequest();
    }

    componentDidMount() {
        this.startRequest();
    }

    componentWillUnmount() {
        this.stopRequest();
    }

    private startRequest() {
        const { itemInfo, textureLoader } = this.props;

        this.stopRequest();
        const image = `object/${itemInfo.image}`;
        this.request = textureLoader.tileSetLoader.get(image, (details) => {
            const texture = details.getAnimations(image)[itemInfo.animation][0];
            this.setState({
                texture
            });
        });
    }

    private stopRequest() {
        if (this.request) {
            this.request.stop();
            this.request = null;
        }
    }
}

export class InventoryItemImage extends React.PureComponent<Props> {
    render() {
        return (
            <TextureLoaderContext.Consumer>
                {this.innerRender}
            </TextureLoaderContext.Consumer>
        );
    }

    private innerRender = (textureLoader: TextureLoader) => {
        return (
            <RawInventoryItemImage textureLoader={textureLoader} {...this.props}/>
        );
    }
}
