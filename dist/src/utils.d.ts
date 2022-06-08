import { FastListProps, FastListState } from "./types";
export declare function computeBlock(containerHeight: number, scrollTop: number, batchSize: number): Partial<FastListState>;
export declare function getFastListState({ headerHeight, footerHeight, sectionHeight, rowHeight, sectionFooterHeight, sections, insetTop, insetBottom, renderAheadMultiplier, renderBehindMultiplier, }: Partial<FastListProps>, { batchSize, blockStart, blockEnd, scrollDirection, items: prevItems, }: Partial<FastListState>): FastListState;
