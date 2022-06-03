import { FastListItem, FastListItemType } from "./types";
/**
 * FastListItemRecycler is used to recycle FastListItem objects between recomputations
 * of the list. By doing this we ensure that components maintain their keys and avoid
 * reallocations.
 */
export declare class FastListItemRecycler {
    static _LAST_KEY: number;
    _items: {
        [x: FastListItemType]: {
            [x: string]: FastListItem;
        };
    };
    _pendingItems: {
        [x: FastListItemType]: Array<FastListItem>;
    };
    constructor(items: Array<FastListItem>);
    _itemsForType(type: FastListItemType): [
        {
            [x: string]: FastListItem;
        },
        Array<FastListItem>
    ];
    get(type: FastListItemType, layoutY: number, layoutHeight: number, section?: number, row?: number): FastListItem;
    _get(type: FastListItemType, layoutY: number, layoutHeight: number, section: number, row: number, items: {
        [x: string]: FastListItem;
    }, pendingItems: Array<FastListItem>): FastListItem;
    fill(): void;
    _fill(items: {
        [x: string]: FastListItem;
    }, pendingItems: Array<FastListItem>): void;
}
