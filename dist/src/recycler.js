"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FastListItemRecycler = void 0;
const lodash_1 = require("lodash");
const constants_1 = require("./constants");
/**
 * FastListItemRecycler is used to recycle FastListItem objects between recomputations
 * of the list. By doing this we ensure that components maintain their keys and avoid
 * reallocations.
 */
class FastListItemRecycler {
    static _LAST_KEY = 0;
    _items = {};
    _pendingItems = {};
    constructor(items) {
        items.forEach((item) => {
            const { type, section, row } = item;
            const [items] = this._itemsForType(type);
            items[`${type}:${section}:${row}`] = item;
        });
    }
    _itemsForType(type) {
        return [
            this._items[type] || (this._items[type] = {}),
            this._pendingItems[type] || (this._pendingItems[type] = []),
        ];
    }
    get(type, layoutY, layoutHeight, section = 0, row = 0) {
        const [items, pendingItems] = this._itemsForType(type);
        return this._get(type, layoutY, layoutHeight, section, row, items, pendingItems);
    }
    _get(type, layoutY, layoutHeight, section, row, items, pendingItems) {
        const itemKey = `${type}:${section}:${row}`;
        let item = items[itemKey];
        if (item == null) {
            item = { type, key: -1, layoutY, layoutHeight, section, row };
            pendingItems.push(item);
        }
        else {
            item.layoutY = layoutY;
            item.layoutHeight = layoutHeight;
            delete items[itemKey];
        }
        return item;
    }
    fill() {
        (0, lodash_1.forEach)(constants_1.FastListItemTypes, (type) => {
            const [items, pendingItems] = this._itemsForType(type);
            this._fill(items, pendingItems);
        });
    }
    _fill(items, pendingItems) {
        let index = 0;
        (0, lodash_1.forEach)(items, ({ key }) => {
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
exports.FastListItemRecycler = FastListItemRecycler;
