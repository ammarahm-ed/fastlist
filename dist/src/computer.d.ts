import { FastListComputerProps, FastListItem, FooterHeight, HeaderHeight, RowHeight, SectionFooterHeight, SectionHeight } from "./types";
export declare class FastListComputer {
    headerHeight: HeaderHeight;
    footerHeight: FooterHeight;
    sectionHeight: SectionHeight;
    rowHeight: RowHeight;
    sectionFooterHeight: SectionFooterHeight;
    sections: Array<number>;
    insetTop: number;
    insetBottom: number;
    uniform: boolean;
    constructor({ headerHeight, footerHeight, sectionHeight, rowHeight, sectionFooterHeight, sections, insetTop, insetBottom, }: FastListComputerProps);
    getHeightForHeader(): number;
    getHeightForFooter(): number;
    getHeightForSection(section: number): number;
    getHeightForRow(section: number, row?: number): number;
    getHeightForSectionFooter(section: number): number;
    compute(top: number, bottom: number, prevItems: Array<FastListItem>, scrollDirection: number, batchSize: number): {
        height: number;
        items: Array<FastListItem>;
    };
    computeScrollPosition(targetSection: number, targetRow: number): {
        scrollTop: number;
        sectionHeight: number;
    };
}
