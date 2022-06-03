"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFastListState = exports.computeBlock = void 0;
const computer_1 = require("./computer");
function computeBlock(containerHeight, scrollTop, batchSize) {
    if (containerHeight === 0) {
        return {
            batchSize: 0,
            blockStart: 0,
            blockEnd: 0,
            scrollDirection: 1,
        };
    }
    const blockNumber = Math.ceil(scrollTop / batchSize);
    const blockStart = batchSize * blockNumber;
    const blockEnd = blockStart + batchSize;
    return { batchSize, blockStart, blockEnd, scrollDirection: 1 };
}
exports.computeBlock = computeBlock;
function getFastListState({ headerHeight, footerHeight, sectionHeight, rowHeight, sectionFooterHeight, sections, insetTop, insetBottom, }, { batchSize, blockStart, blockEnd, scrollDirection, items: prevItems, }) {
    if (batchSize === 0) {
        return {
            batchSize,
            blockStart,
            blockEnd,
            height: insetTop + insetBottom,
            items: [],
            scrollDirection: 1,
        };
    }
    const computer = new computer_1.FastListComputer({
        headerHeight,
        footerHeight,
        sectionHeight,
        rowHeight,
        sectionFooterHeight,
        sections,
        insetTop,
        insetBottom,
    });
    return {
        batchSize,
        blockStart,
        blockEnd,
        ...computer.compute(blockStart - batchSize, blockEnd + batchSize, prevItems || [], scrollDirection, batchSize),
    };
}
exports.getFastListState = getFastListState;
