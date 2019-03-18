import * as React from 'react';
import Tooltip from 'react-tooltip-lite';
import { StyleRules, WithStyles } from '../interfaces';
import { injectSheet, NOT_SMALL_DEVICE, SMALL_DEVICE } from '../utils';
import { black, brown, quality, quest } from '../theme';
import { InventoryItemTooltip } from './InventoryItemTooltip';
import { BORDER_RADIUS, SCALE, SLOT_PADDING } from './InventorySlot';
import { InventoryItemImage } from './InventoryItemImage';
import { ItemInfo } from '../../../../common/protocol/ItemInfo';
import { ItemQuality } from '../../../../common/protocol/Inventory';

const IMAGE_SIZE = 32;
const CROPPED_SIZE = 28;

const CROP = (IMAGE_SIZE - CROPPED_SIZE) / 2;

type ClassKeys = 'root' | 'tooltip' | 'image' | 'backgroundDecoration' | 'decoration' | 'overlay' | 'count';

const styles: StyleRules<ClassKeys> = {
    root: {
        overflow: 'hidden',
        position: 'relative',
        imageRendering: 'pixelated',
        fallback: {
            imageRendering: 'crisp-edges',
        },

        width: CROPPED_SIZE,
        height: CROPPED_SIZE,

        [NOT_SMALL_DEVICE]: {
            width: CROPPED_SIZE * SCALE,
            height: CROPPED_SIZE * SCALE,
        },
    },
    tooltip: {
        display: 'inline-block',
    },
    backgroundDecoration: {
        position: 'absolute',
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,

        borderRadius: BORDER_RADIUS - SLOT_PADDING,
        [NOT_SMALL_DEVICE]: {
            borderRadius: BORDER_RADIUS * SCALE - SLOT_PADDING,
        },
    },
    decoration: {
        boxSizing: 'border-box',

        borderStyle: 'solid',
        borderWidth: 1,
        borderLeftColor: brown.normal,
        borderTopColor: brown.lighter,
        borderRightColor: brown.darker,
        borderBottomColor: brown.darkest,

        position: 'absolute',
        left: 0,
        top: 0,
        width: CROPPED_SIZE,
        height: CROPPED_SIZE,

        borderRadius: BORDER_RADIUS - SLOT_PADDING,

        [NOT_SMALL_DEVICE]: {
            transformOriginX: 0,
            transformOriginY: 0,
            transform: `scale(${SCALE})`,
        },
    },
    overlay: {
        position: 'absolute',
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        borderRadius: BORDER_RADIUS,

        [NOT_SMALL_DEVICE]: {
            borderRadius: BORDER_RADIUS * SCALE,
        },

        '&:hover': {
            backgroundColor: '#fffba7',
            opacity: 0.2,
        },
    },
    image: {
        transformOrigin: 'left top',
        overflow: 'hidden',
        position: 'absolute',
        width: CROPPED_SIZE,
        height: CROPPED_SIZE,

        transform: `scale(1)`,
        borderRadius: BORDER_RADIUS,

        '& > canvas': {
            marginLeft: -CROP,
            marginTop: -CROP,
        },

        [NOT_SMALL_DEVICE]: {
            transform: `scale(${SCALE})`,
        },
    },
    count: {
        fontSize: 16,
        color: brown.lightest,
        textShadow: `0 0 4px ${black}, 0 0 2px ${black}`,
        position: 'absolute',
        right: SLOT_PADDING,
        bottom: SLOT_PADDING,

        [SMALL_DEVICE]: {
            fontSize: 12,
        },
    },
};

interface Props {
    item: ItemInfo;
}

class RawInventoryItemIcon extends React.Component<Props & WithStyles<ClassKeys>> {
    render() {
        const { item, classes } = this.props;

        return (
            <Tooltip arrow={false} content={<InventoryItemTooltip item={item}/>} direction="right"
                     className={classes.tooltip}>
                <div className={classes.root}>
                    <div className={classes.backgroundDecoration}
                         style={{ backgroundColor: item.questItem ? quest.active : brown.darkest }}/>
                    <div className={classes.image}>
                        <InventoryItemImage item={item}/>
                    </div>
                    <div className={classes.decoration} style={{ boxShadow: boxShadow(item.quality) }}/>
                    {item.count > 1 && <div className={classes.count}>{item.count}</div>}
                    <div className={classes.overlay}/>
                </div>
            </Tooltip>
        );
    }
}

export const InventoryItemIcon = injectSheet(styles)(RawInventoryItemIcon);

function boxShadow(itemQuality: ItemQuality): string {
    if (itemQuality === 'common') {
        return 'none';
    }
    return `inset 0 0 5px 3px ${quality[itemQuality]}`;
}