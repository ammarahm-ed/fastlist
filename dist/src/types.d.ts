import React from "react";
import { Animated, LayoutChangeEvent, NativeScrollEvent, NativeSyntheticEvent, ScrollViewProps } from "react-native";
import { FastListItemTypes } from "./constants";
export declare type HeaderHeight = number | (() => number);
export declare type FooterHeight = number | (() => number);
export declare type SectionHeight = number | ((section: number) => number);
export declare type RowHeight = number | ((section: number, row?: number) => number);
export declare type SectionFooterHeight = number | ((section: number) => number);
export declare type FastListItemType = typeof FastListItemTypes[keyof typeof FastListItemTypes];
export declare type FastListItem = {
    type: FastListItemType;
    key: number;
    layoutY: number;
    layoutHeight: number;
    section: number;
    row: number;
};
export declare type FastListComputerProps = {
    headerHeight: HeaderHeight;
    footerHeight: FooterHeight;
    sectionHeight: SectionHeight;
    rowHeight: RowHeight;
    sectionFooterHeight: SectionFooterHeight;
    sections: Array<number>;
    insetTop: number;
    insetBottom: number;
};
export declare type FastListState = {
    batchSize?: number;
    blockStart?: number;
    blockEnd?: number;
    height?: number;
    items?: Array<FastListItem>;
    scrollDirection?: number;
};
export declare type FastListProps = {
    batchSize: (height: number, velocity?: {
        x: number;
        y: number;
    }) => number;
    listKey?: string;
    isFastList?: boolean;
    renderActionSheetScrollViewWrapper?: (a: React.ReactNode) => React.ReactNode;
    actionSheetScrollRef?: {
        current: React.ReactNode;
    };
    onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
    onScrollEnd?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
    onLayout?: (event: LayoutChangeEvent) => void;
    renderHeader: () => React.ReactNode;
    renderFooter: () => React.ReactNode;
    renderSection: (section: number) => React.ReactNode;
    renderRow: (section: number, row: number) => React.ReactNode;
    renderSectionFooter: (section: number) => React.ReactNode;
    renderAccessory?: () => React.ReactNode;
    renderEmpty?: () => React.ReactNode;
    headerHeight: HeaderHeight;
    footerHeight: FooterHeight;
    sectionHeight: SectionHeight;
    sectionFooterHeight: SectionFooterHeight;
    rowHeight: RowHeight;
    sections: Array<number>;
    insetTop: number;
    insetBottom: number;
    scrollTopValue?: Animated.Value;
    contentInset: {
        top?: number;
        left?: number;
        right?: number;
        bottom?: number;
    };
} & ScrollViewProps;
