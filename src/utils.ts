import { FastListComputer } from "./computer";
import { FastListProps, FastListState } from "./types";

export function computeBlock(
  containerHeight: number,
  scrollTop: number,
  batchSize: number
): Partial<FastListState> {
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

export function getFastListState(
  {
    headerHeight,
    footerHeight,
    sectionHeight,
    rowHeight,
    sectionFooterHeight,
    sections,
    insetTop,
    insetBottom,
  }: Partial<FastListProps>,
  {
    batchSize,
    blockStart,
    blockEnd,
    scrollDirection,
    items: prevItems,
  }: Partial<FastListState>
): FastListState {
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
      blockStart - batchSize,

      blockEnd + batchSize,
      prevItems || [],
      scrollDirection,
      batchSize
    ),
  };
}
