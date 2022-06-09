import { FastListComputer } from "./computer";
export function computeBlock(containerHeight, scrollTop, batchSize) {
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
export function getFastListState({ headerHeight, footerHeight, sectionHeight, rowHeight, sectionFooterHeight, sections, insetTop, insetBottom, renderAheadMultiplier = 2, renderBehindMultiplier = 1, }, { batchSize, blockStart, blockEnd, scrollDirection, items: prevItems, }) {
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
    const computer = new FastListComputer({
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
        ...computer.compute(
        // We know which direction the user is scrolling in so that
        // We can render more items there instead and save memory/cpu.
        blockStart, blockEnd, prevItems || [], scrollDirection, batchSize, renderAheadMultiplier, renderBehindMultiplier),
    };
}
