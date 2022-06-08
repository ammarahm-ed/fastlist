"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FastListComputer = void 0;
const constants_1 = require("./constants");
const recycler_1 = require("./recycler");
class FastListComputer {
    headerHeight;
    footerHeight;
    sectionHeight;
    rowHeight;
    sectionFooterHeight;
    sections;
    insetTop;
    insetBottom;
    uniform;
    constructor({ headerHeight, footerHeight, sectionHeight, rowHeight, sectionFooterHeight, sections, insetTop, insetBottom, }) {
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
    getHeightForHeader() {
        const { headerHeight } = this;
        return typeof headerHeight === "number" ? headerHeight : headerHeight();
    }
    getHeightForFooter() {
        const { footerHeight } = this;
        return typeof footerHeight === "number" ? footerHeight : footerHeight();
    }
    getHeightForSection(section) {
        const { sectionHeight } = this;
        return typeof sectionHeight === "number"
            ? sectionHeight
            : sectionHeight(section);
    }
    getHeightForRow(section, row) {
        const { rowHeight } = this;
        return typeof rowHeight === "number" ? rowHeight : rowHeight(section, row);
    }
    getHeightForSectionFooter(section) {
        const { sectionFooterHeight } = this;
        return typeof sectionFooterHeight === "number"
            ? sectionFooterHeight
            : sectionFooterHeight(section);
    }
    compute(top, bottom, prevItems, scrollDirection, batchSize, renderAheadMultiplier, renderBehindMultiplier) {
        const { sections } = this;
        let height = this.insetTop;
        let spacerHeight = height;
        let items = [];
        // Render twice as much items in the direction we are scrolling
        // to prevent blanks/flickering when scrolling fast.
        if (!scrollDirection) {
            top = top - batchSize * renderAheadMultiplier;
            bottom = bottom + batchSize * renderBehindMultiplier;
        }
        else {
            top = top - batchSize * renderBehindMultiplier;
            bottom = bottom + batchSize * renderAheadMultiplier;
        }
        const recycler = new recycler_1.FastListItemRecycler(prevItems);
        function isVisible(itemHeight) {
            const prevHeight = height;
            height += itemHeight;
            if (height < top || prevHeight > bottom) {
                spacerHeight += itemHeight;
                return false;
            }
            else {
                return true;
            }
        }
        function isAbove(itemHeight) {
            const prevHeight = height;
            height += itemHeight;
            if (prevHeight > bottom) {
                spacerHeight += itemHeight;
                return false;
            }
            else {
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
                if (item.type !== constants_1.FastListItemTypes.SECTION &&
                    item.type !== constants_1.FastListItemTypes.SPACER) {
                    break;
                }
            }
            for (let index = firstItemIndex; index >= 0 && index < items.length; index--) {
                const item = items[index];
                if (firstSectionIndex) {
                    firstSpacerHeight += item.layoutHeight;
                }
                else if (item.type === constants_1.FastListItemTypes.SECTION) {
                    firstSectionIndex = index;
                }
            }
            if (firstSectionIndex) {
                const spacer = recycler.get(constants_1.FastListItemTypes.SPACER, 0, firstSpacerHeight, 0);
                items = [spacer, ...items.slice(firstSectionIndex)];
            }
        }
        function push(item) {
            if (spacerHeight > 0) {
                items.push(recycler.get(constants_1.FastListItemTypes.SPACER, item.layoutY - spacerHeight, spacerHeight, item.section, item.row));
                spacerHeight = 0;
            }
            items.push(item);
        }
        let layoutY;
        const headerHeight = this.getHeightForHeader();
        if (headerHeight > 0) {
            layoutY = height;
            if (isVisible(headerHeight)) {
                push(recycler.get(constants_1.FastListItemTypes.HEADER, layoutY, headerHeight));
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
                push(recycler.get(constants_1.FastListItemTypes.SECTION, layoutY, sectionHeight, section));
            }
            if (this.uniform) {
                const rowHeight = this.getHeightForRow(section);
                for (let row = 0; row < rows; row++) {
                    layoutY = height;
                    if (isVisible(rowHeight)) {
                        push(recycler.get(constants_1.FastListItemTypes.ROW, layoutY, rowHeight, section, row));
                    }
                }
            }
            else {
                for (let row = 0; row < rows; row++) {
                    const rowHeight = this.getHeightForRow(section, row);
                    layoutY = height;
                    if (isVisible(rowHeight)) {
                        push(recycler.get(constants_1.FastListItemTypes.ROW, layoutY, rowHeight, section, row));
                    }
                }
            }
            const sectionFooterHeight = this.getHeightForSectionFooter(section);
            if (sectionFooterHeight > 0) {
                layoutY = height;
                if (isVisible(sectionFooterHeight)) {
                    push(recycler.get(constants_1.FastListItemTypes.SECTION_FOOTER, layoutY, sectionFooterHeight, section));
                }
            }
        }
        const footerHeight = this.getHeightForFooter();
        if (footerHeight > 0) {
            layoutY = height;
            if (isVisible(footerHeight)) {
                push(recycler.get(constants_1.FastListItemTypes.FOOTER, layoutY, footerHeight));
            }
        }
        height += this.insetBottom;
        spacerHeight += this.insetBottom;
        if (spacerHeight > 0) {
            items.push(recycler.get(constants_1.FastListItemTypes.SPACER, height - spacerHeight, spacerHeight, sections.length));
        }
        mergeSections();
        recycler.fill();
        console.log(items.length, "items in batch");
        return {
            height,
            items,
        };
    }
    computeScrollPosition(targetSection, targetRow) {
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
                }
                else {
                    scrollTop += uniformHeight * rows;
                }
            }
            else {
                for (let row = 0; row < rows; row++) {
                    if (section < targetSection ||
                        (section === targetSection && row < targetRow)) {
                        scrollTop += this.getHeightForRow(section, row);
                    }
                    else if (section === targetSection && row === targetRow) {
                        foundRow = true;
                        break;
                    }
                }
            }
            if (!foundRow)
                scrollTop += this.getHeightForSectionFooter(section);
            section += 1;
        }
        return {
            scrollTop,
            sectionHeight: this.getHeightForSection(targetSection),
        };
    }
}
exports.FastListComputer = FastListComputer;
