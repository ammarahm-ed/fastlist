import React from "react";
import { Animated, LayoutChangeEvent, NativeScrollEvent, NativeSyntheticEvent } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { FastListItem, FastListProps, FastListState } from "./types";
export default class FastList extends React.PureComponent<FastListProps, FastListState> {
    static defaultProps: {
        isFastList: boolean;
        renderHeader: () => any;
        renderFooter: () => any;
        renderSection: () => any;
        renderSectionFooter: () => any;
        FastListItemRenderer: ({ layoutHeight: height, children, }: {
            layoutHeight: number;
            children?: React.ReactNode;
        }) => JSX.Element;
        headerHeight: number;
        footerHeight: number;
        sectionHeight: number;
        sectionFooterHeight: number;
        insetTop: number;
        insetBottom: number;
        contentInset: {
            top: number;
            right: number;
            left: number;
            bottom: number;
        };
    };
    scrollDirection: number;
    containerHeight: number;
    scrollTop: number;
    scrollTopValue: Animated.Value;
    scrollTopValueAttachment: {
        detach: () => void;
    } | null | undefined;
    scrollView: React.RefObject<ScrollView>;
    state: FastListState;
    prevScrollValue: number;
    static getDerivedStateFromProps(props: FastListProps, state: FastListState): FastListState;
    getItems(): Array<FastListItem>;
    isVisible: (layoutY: number) => boolean;
    scrollToLocation: (section: number, row: number, animated?: boolean) => void;
    handleScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
    handleLayout: (event: LayoutChangeEvent) => void;
    /**
     * FastList only re-renders when items change which which does not happen with
     * every scroll event. Since an accessory might depend on scroll position this
     * ensures the accessory at least re-renders when scrolling ends
     */
    handleScrollEnd: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
    renderItems(): React.ReactNode;
    componentDidMount(): void;
    componentDidUpdate(prevProps: FastListProps): void;
    componentWillUnmount(): void;
    isEmpty: () => boolean;
    getRef: (ref: any) => void;
    wrapper: (a: React.ReactNode) => React.ReactNode;
    scrollViewComponent: () => React.ReactNode;
    render(): JSX.Element;
}
