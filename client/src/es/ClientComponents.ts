import { NetworkComponents } from '../../../common/components/NetworkComponents';
import { EntityDisplay } from '../display/EntityDisplay';

export interface ClientComponents extends NetworkComponents {
    display: EntityDisplay;
    mouseOver: true;
    fixAnimationSpeed: number | null;
    shadowSize: number;
}
