import React from "react";
import {
  Animated,
  LayoutChangeEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { FastListComputer } from "./computer";
import { FastListItemTypes, ScrollDirection } from "./constants";
import { FastListItemRenderer } from "./item";
import { FastListSectionRenderer } from "./section";
import { FastListItem, FastListProps, FastListState } from "./types";
import { computeBlock, getFastListState } from "./utils";

export default class FastList extends React.PureComponent<
  FastListProps,
  FastListState
> {
  static defaultProps = {
    isFastList: true,
    renderHeader: () => null,
    renderFooter: () => null,
    renderSection: () => null,
    renderSectionFooter: () => null,
    headerHeight: 0,
    footerHeight: 0,
    sectionHeight: 0,
    sectionFooterHeight: 0,
    insetTop: 0,
    insetBottom: 0,
    contentInset: { top: 0, right: 0, left: 0, bottom: 0 },
  };
  scrollDirection: number = 1;
  containerHeight: number = 0;
  scrollTop: number = 0;
  scrollTopValue: Animated.Value =
    this.props.scrollTopValue || new Animated.Value(0);
  scrollTopValueAttachment:
    | {
        detach: () => void;
      }
    | null
    | undefined;
  scrollView = React.createRef<ScrollView>();

  state: FastListState = getFastListState(
    this.props,
    computeBlock(
      this.containerHeight,
      this.scrollTop,
      this.props.batchSize(this.containerHeight)
    )
  );
  prevScrollValue = 0;

  static getDerivedStateFromProps(props: FastListProps, state: FastListState) {
    return getFastListState(props, state);
  }

  getItems(): Array<FastListItem> {
    return this.state.items;
  }

  isVisible = (layoutY: number): boolean => {
    return (
      layoutY >= this.scrollTop &&
      layoutY <= this.scrollTop + this.containerHeight
    );
  };

  scrollToLocation = (
    section: number,
    row: number,
    animated: boolean = true
  ) => {
    const scrollView = this.scrollView.current;
    if (scrollView != null) {
      const {
        headerHeight,
        footerHeight,
        sectionHeight,
        rowHeight,
        sectionFooterHeight,
        sections,
        insetTop,
        insetBottom,
      } = this.props;
      const computer = new FastListComputer({
        headerHeight,
        footerHeight,
        sectionHeight,
        sectionFooterHeight,
        rowHeight,
        sections,
        insetTop,
        insetBottom,
      });
      const { scrollTop: layoutY, sectionHeight: layoutHeight } =
        computer.computeScrollPosition(section, row);
      scrollView.scrollTo({
        x: 0,
        y: Math.max(0, layoutY - layoutHeight),
        animated,
      });
    }
  };

  handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { nativeEvent } = event;
    const { contentInset } = this.props;

    this.containerHeight =
      nativeEvent.layoutMeasurement.height -
      (contentInset.top || 0) -
      (contentInset.bottom || 0);
    this.scrollTop = Math.min(
      Math.max(0, nativeEvent.contentOffset.y),
      nativeEvent.contentSize.height - this.containerHeight
    );

    if (this.scrollTop < this.prevScrollValue)
      this.scrollDirection = ScrollDirection.UP;
    else this.scrollDirection = ScrollDirection.DOWN;

    this.prevScrollValue = this.scrollTop;
    const nextState = computeBlock(
      this.containerHeight,
      this.scrollTop,
      this.props.batchSize(this.containerHeight, event.nativeEvent.velocity)
    );
    nextState.scrollDirection = this.scrollDirection;

    if (
      nextState.batchSize !== this.state.batchSize ||
      nextState.blockStart !== this.state.blockStart ||
      nextState.blockEnd !== this.state.blockEnd ||
      nextState.scrollDirection !== this.state.scrollDirection
    ) {
      this.setState(nextState);
    }

    const { onScroll } = this.props;
    if (onScroll != null) {
      onScroll(event);
    }
  };

  handleLayout = (event: LayoutChangeEvent) => {
    const { nativeEvent } = event;
    const { contentInset } = this.props;

    this.containerHeight =
      nativeEvent.layout.height -
      (contentInset.top || 0) -
      (contentInset.bottom || 0);

    const nextState = computeBlock(
      this.containerHeight,
      this.scrollTop,
      this.props.batchSize(this.containerHeight)
    );

    if (
      nextState.batchSize !== this.state.batchSize ||
      nextState.blockStart !== this.state.blockStart ||
      nextState.blockEnd !== this.state.blockEnd
    ) {
      this.setState(nextState);
    }

    const { onLayout } = this.props;
    if (onLayout != null) {
      onLayout(event);
    }
  };
  /**
   * FastList only re-renders when items change which which does not happen with
   * every scroll event. Since an accessory might depend on scroll position this
   * ensures the accessory at least re-renders when scrolling ends
   */
  handleScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { renderAccessory, onScrollEnd } = this.props;
    if (renderAccessory != null) {
      this.forceUpdate();
    }
    onScrollEnd && onScrollEnd(event);
  };

  renderItems(): React.ReactNode {
    const {
      renderHeader,
      renderFooter,
      renderSection,
      renderRow,
      renderSectionFooter,
      renderEmpty,
    } = this.props;
    const { items } = this.state;

    if (renderEmpty != null && this.isEmpty()) {
      return renderEmpty();
    }

    const sectionLayoutYs = [];
    items.forEach(({ type, layoutY }) => {
      if (type === FastListItemTypes.SECTION) {
        sectionLayoutYs.push(layoutY);
      }
    });

    const children: React.ReactNode[] = [];
    items.forEach(({ type, key, layoutY, layoutHeight, section, row }) => {
      switch (type) {
        case FastListItemTypes.SPACER: {
          children.push(
            <FastListItemRenderer key={key} layoutHeight={layoutHeight} />
          );
          break;
        }
        case FastListItemTypes.HEADER: {
          const child = renderHeader();
          if (child != null) {
            children.push(
              <FastListItemRenderer key={key} layoutHeight={layoutHeight}>
                {child}
              </FastListItemRenderer>
            );
          }
          break;
        }
        case FastListItemTypes.FOOTER: {
          const child = renderFooter();
          if (child != null) {
            children.push(
              <FastListItemRenderer key={key} layoutHeight={layoutHeight}>
                {child}
              </FastListItemRenderer>
            );
          }
          break;
        }
        case FastListItemTypes.SECTION: {
          sectionLayoutYs.shift();
          const child = renderSection(section);
          if (child != null) {
            children.push(
              <FastListSectionRenderer
                key={key}
                layoutY={layoutY}
                layoutHeight={layoutHeight}
                nextSectionLayoutY={sectionLayoutYs[0]}
                scrollTopValue={this.scrollTopValue}
              >
                {child}
              </FastListSectionRenderer>
            );
          }
          break;
        }
        case FastListItemTypes.ROW: {
          const child = renderRow(section, row);
          if (child != null) {
            children.push(
              <FastListItemRenderer key={key} layoutHeight={layoutHeight}>
                {child}
              </FastListItemRenderer>
            );
          }
          break;
        }
        case FastListItemTypes.SECTION_FOOTER: {
          const child = renderSectionFooter(section);
          if (child != null) {
            children.push(
              <FastListItemRenderer key={key} layoutHeight={layoutHeight}>
                {child}
              </FastListItemRenderer>
            );
          }
          break;
        }
      }
    });

    return children;
  }

  componentDidMount() {
    if (this.scrollView.current != null) {
      //@ts-ignore
      this.scrollTopValueAttachment = Animated.attachNativeEvent(
        this.scrollView.current,
        "onScroll",
        [{ nativeEvent: { contentOffset: { y: this.scrollTopValue } } }]
      );
    }
  }

  componentDidUpdate(prevProps: FastListProps) {
    if (prevProps.scrollTopValue !== this.props.scrollTopValue) {
      throw new Error("scrollTopValue cannot changed after mounting");
    }
  }

  componentWillUnmount() {
    if (this.scrollTopValueAttachment != null) {
      this.scrollTopValueAttachment.detach();
    }
  }

  isEmpty = () => {
    const { sections } = this.props;
    const length = sections.reduce((length, rowLength) => {
      return length + rowLength;
    }, 0);
    return length === 0;
  };

  getRef = (ref) => {
    //@ts-ignore
    this.scrollView.current = ref;
    if (this.props.actionSheetScrollRef) {
      this.props.actionSheetScrollRef.current = ref;
    }
  };

  // what is this??
  // well! in order to support continuous scrolling of a scrollview/list/whatever in an action sheet, we need
  // to wrap the scrollview in a NativeViewGestureHandler. This wrapper does that thing that need do
  wrapper = this.props.renderActionSheetScrollViewWrapper || ((val) => val);
  scrollViewComponent = () =>
    this.wrapper(
      <ScrollView
        {...this.props}
        ref={this.getRef}
        removeClippedSubviews={false}
        scrollEventThrottle={16}
        onScroll={this.handleScroll}
        onLayout={this.handleLayout}
        onMomentumScrollEnd={this.handleScrollEnd}
        onScrollEndDrag={this.handleScrollEnd}
      >
        {
          //@ts-ignore
          this.renderItems()
        }
      </ScrollView>
    );

  render() {
    const scroller = this.scrollViewComponent();
    return (
      <>
        {scroller}
        {this.props.renderAccessory != null
          ? this.props.renderAccessory()
          : null}
      </>
    );
  }
}
