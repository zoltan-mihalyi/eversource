import { NetworkComponents } from '../../../common/components/NetworkComponents';
import { EntityDisplay } from '../display/EntityDisplay';

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
}
