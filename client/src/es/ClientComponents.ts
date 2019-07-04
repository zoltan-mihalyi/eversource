import { NetworkComponents } from '../../../common/components/NetworkComponents';
import { EntityDisplay } from '../display/EntityDisplay';
import { EntityId } from '../../../common/es/Entity';

interface ChatMessageDisplay {
    text: string;
    createdAt: Date;
}

export interface ClientComponents extends NetworkComponents {
    display: EntityDisplay;
    chatMessageDisplay: ChatMessageDisplay;
    mouseOver: true;
    fixAnimationSpeed: number | null;
    shadowSize: number;
    targetMark: PIXI.DisplayObject;
}
