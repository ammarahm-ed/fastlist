import { FastListItemTypes } from "./constants";
import { FastListItemRecycler } from "./recycler";
import {
  FastListComputerProps,
  FastListItem,
  FooterHeight,
  HeaderHeight,
  RowHeight,
  SectionFooterHeight,
  SectionHeight,
} from "./types";

export class FastListComputer {
  headerHeight: HeaderHeight;
  footerHeight: FooterHeight;
  sectionHeight: SectionHeight;
  rowHeight: RowHeight;
  sectionFooterHeight: SectionFooterHeight;
  sections: Array<number>;
  insetTop: number;
  insetBottom: number;
  uniform: boolean;

  constructor({
    headerHeight,
    footerHeight,
    sectionHeight,
    rowHeight,
    sectionFooterHeight,
    sections,
    insetTop,
    insetBottom,
  }: FastListComputerProps) {
    this.headerHeight = headerHeight;
    this.footerHeight = footerHeight;
    this.sectionHeight = sectionHeight;
    this.rowHeight = rowHeight;
    this.sectionFooterHeight = sectionFooterHeight;
    this.sections = sections;
    this.insetTop = insetTop;
    this.insetBottom = insetBottom;
    this.uniform = typeof rowHeight === "number";
  }

  getHeightForHeader(): number {
    const { headerHeight } = this;
    return typeof headerHeight === "number" ? headerHeight : headerHeight();
  }

  getHeightForFooter(): number {
    const { footerHeight } = this;
    return typeof footerHeight === "number" ? footerHeight : footerHeight();
  }

  getHeightForSection(section: number): number {
    const { sectionHeight } = this;
    return typeof sectionHeight === "number"
      ? sectionHeight
      : sectionHeight(section);
  }

  getHeightForRow(section: number, row?: number): number {
    const { rowHeight } = this;
    return typeof rowHeight === "number" ? rowHeight : rowHeight(section, row);
  }

  getHeightForSectionFooter(section: number): number {
    const { sectionFooterHeight } = this;
    return typeof sectionFooterHeight === "number"
      ? sectionFooterHeight
      : sectionFooterHeight(section);
  }

  compute(
    top: number,
    bottom: number,
    prevItems: Array<FastListItem>,
    scrollDirection: number,
    batchSize: number
  ): {
    height: number;
    items: Array<FastListItem>;
  } {
    const { sections } = this;
    let height = this.insetTop;
    let spacerHeight = height;
    let items: Array<FastListItem> = [];
    if (!scrollDirection) {
      top = top - batchSize;
    } else {
      bottom = bottom + batchSize;
    }

    const recycler = new FastListItemRecycler(prevItems);
    function isVisible(itemHeight: number): boolean {
      const prevHeight = height;
      height += itemHeight;
      if (height < top || prevHeight > bottom) {
        spacerHeight += itemHeight;
        return false;
      } else {
        return true;
      }
    }

    function isAbove(itemHeight: number): boolean {
      const prevHeight = height;
      height += itemHeight;

      if (prevHeight > bottom) {
        spacerHeight += itemHeight;
        return false;
      } else {
        return true;
      }
    }

    // This optimization merges non-visible sections (except the first floating/sticky one!)
    // into one spacer, which reduces the amount of items that we will render.
    function mergeSections() {
      let firstSectionIndex = null;
      let firstSpacerHeight = 0;
      let firstItemIndex = 0;
      for (firstItemIndex; firstItemIndex < items.length; firstItemIndex++) {
        const item = items[firstItemIndex];
        if (
          item.type !== FastListItemTypes.SECTION &&
          item.type !== FastListItemTypes.SPACER
        ) {
          break;
        }
      }

      for (
        let index = firstItemIndex;
        index >= 0 && index < items.length;
        index--
      ) {
        const item = items[index];
        if (firstSectionIndex) {
          firstSpacerHeight += item.layoutHeight;
        } else if (item.type === FastListItemTypes.SECTION) {
          firstSectionIndex = index;
        }
      }
      if (firstSectionIndex) {
        const spacer = recycler.get(
          FastListItemTypes.SPACER,
          0,
          firstSpacerHeight,
          0
        );
        items = [spacer, ...items.slice(firstSectionIndex)];
      }
    }

    function push(item: FastListItem) {
      if (spacerHeight > 0) {
        items.push(
          recycler.get(
            FastListItemTypes.SPACER,
            item.layoutY - spacerHeight,
            spacerHeight,
            item.section,
            item.row
          )
        );
        spacerHeight = 0;
      }

      items.push(item);
    }

    let layoutY;

    const headerHeight = this.getHeightForHeader();
    if (headerHeight > 0) {
      layoutY = height;
      if (isVisible(headerHeight)) {
        push(recycler.get(FastListItemTypes.HEADER, layoutY, headerHeight));
      }
    }

    for (let section = 0; section < sections.length; section++) {
      const rows = sections[section];

      if (rows === 0) {
        continue;
      }

      layoutY = height;

      const sectionHeight = this.getHeightForSection(section);

      if (isAbove(sectionHeight)) {
        push(
          recycler.get(
            FastListItemTypes.SECTION,
            layoutY,
            sectionHeight,
            section
          )
        );
      }

      if (this.uniform) {
        const rowHeight = this.getHeightForRow(section);
        for (let row = 0; row < rows; row++) {
          layoutY = height;
          if (isVisible(rowHeight)) {
            push(
              recycler.get(
                FastListItemTypes.ROW,
                layoutY,
                rowHeight,
                section,
                row
              )
            );
          }
        }
      } else {
        for (let row = 0; row < rows; row++) {
          const rowHeight = this.getHeightForRow(section, row);
          layoutY = height;
          if (isVisible(rowHeight)) {
            push(
              recycler.get(
                FastListItemTypes.ROW,
                layoutY,
                rowHeight,
                section,
                row
              )
            );
          }
        }
      }

      const sectionFooterHeight = this.getHeightForSectionFooter(section);
      if (sectionFooterHeight > 0) {
        layoutY = height;
        if (isVisible(sectionFooterHeight)) {
          push(
            recycler.get(
              FastListItemTypes.SECTION_FOOTER,
              layoutY,
              sectionFooterHeight,
              section
            )
          );
        }
      }
    }

    const footerHeight = this.getHeightForFooter();
    if (footerHeight > 0) {
      layoutY = height;
      if (isVisible(footerHeight)) {
        push(recycler.get(FastListItemTypes.FOOTER, layoutY, footerHeight));
      }
    }

    height += this.insetBottom;
    spacerHeight += this.insetBottom;
    if (spacerHeight > 0) {
      items.push(
        recycler.get(
          FastListItemTypes.SPACER,
          height - spacerHeight,
          spacerHeight,
          sections.length
        )
      );
    }

    mergeSections();
    recycler.fill();

    return {
      height,
      items,
    };
  }

  computeScrollPosition(
    targetSection: number,
    targetRow: number
  ): {
    scrollTop: number;
    sectionHeight: number;
  } {
    const { sections, insetTop } = this;
    let scrollTop = insetTop + this.getHeightForHeader();
    let section = 0;
    let foundRow = false;

    while (section <= targetSection) {
      const rows = sections[section];
      if (rows === 0) {
        section += 1;
        continue;
      }
      scrollTop += this.getHeightForSection(section);
      if (this.uniform) {
        const uniformHeight = this.getHeightForRow(section);
        if (section === targetSection) {
          scrollTop += uniformHeight * targetRow;
          foundRow = true;
        } else {
          scrollTop += uniformHeight * rows;
        }
      } else {
        for (let row = 0; row < rows; row++) {
          if (
            section < targetSection ||
            (section === targetSection && row < targetRow)
          ) {
            scrollTop += this.getHeightForRow(section, row);
          } else if (section === targetSection && row === targetRow) {
            foundRow = true;
            break;
          }
        }
      }
      if (!foundRow) scrollTop += this.getHeightForSectionFooter(section);
      section += 1;
    }

    return {
      scrollTop,
      sectionHeight: this.getHeightForSection(targetSection),
    };
  }
}
