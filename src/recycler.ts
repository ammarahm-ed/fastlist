import { forEach } from "lodash";
import { FastListItemTypes } from "./constants";
import { FastListItem, FastListItemType } from "./types";
/**
 * FastListItemRecycler is used to recycle FastListItem objects between recomputations
 * of the list. By doing this we ensure that components maintain their keys and avoid
 * reallocations.
 */
export class FastListItemRecycler {
  static _LAST_KEY: number = 0;

  _items: {
    [x: FastListItemType]: {
      [x: string]: FastListItem;
    };
  } = {};
  _pendingItems: {
    [x: FastListItemType]: Array<FastListItem>;
  } = {};

  constructor(items: Array<FastListItem>) {
    items.forEach((item) => {
      const { type, section, row } = item;
      const [items] = this._itemsForType(type);
      items[`${type}:${section}:${row}`] = item;
    });
  }

  _itemsForType(type: FastListItemType): [
    {
      [x: string]: FastListItem;
    },
    Array<FastListItem>
  ] {
    return [
      this._items[type] || (this._items[type] = {}),

      this._pendingItems[type] || (this._pendingItems[type] = []),
    ];
  }

  get(
    type: FastListItemType,
    layoutY: number,
    layoutHeight: number,
    section: number = 0,
    row: number = 0
  ): FastListItem {
    const [items, pendingItems] = this._itemsForType(type);
    return this._get(
      type,
      layoutY,
      layoutHeight,
      section,
      row,
      items,
      pendingItems
    );
  }

  _get(
    type: FastListItemType,
    layoutY: number,
    layoutHeight: number,
    section: number,
    row: number,
    items: {
      [x: string]: FastListItem;
    },
    pendingItems: Array<FastListItem>
  ) {
    const itemKey = `${type}:${section}:${row}`;
    let item = items[itemKey];
    if (item == null) {
      item = { type, key: -1, layoutY, layoutHeight, section, row };
      pendingItems.push(item);
    } else {
      item.layoutY = layoutY;
      item.layoutHeight = layoutHeight;
      delete items[itemKey];
    }
    return item;
  }

  fill() {
    forEach(FastListItemTypes, (type) => {
      const [items, pendingItems] = this._itemsForType(type);
      this._fill(items, pendingItems);
    });
  }

  _fill(
    items: {
      [x: string]: FastListItem;
    },
    pendingItems: Array<FastListItem>
  ) {
    let index = 0;

    forEach(items, ({ key }) => {
      const item = pendingItems[index];
      if (item == null) {
        return false;
      }
      item.key = key;
      index++;
    });

    for (; index < pendingItems.length; index++) {
      pendingItems[index].key = ++FastListItemRecycler._LAST_KEY;
    }

    pendingItems.length = 0;
  }
}
