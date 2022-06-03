import React from "react";
import { Animated } from "react-native";
export const FastListSectionRenderer = ({
  layoutY,
  layoutHeight,
  nextSectionLayoutY,
  scrollTopValue,
  children,
}: {
  layoutY: number;
  layoutHeight: number;
  nextSectionLayoutY?: number;
  scrollTopValue: Animated.Value;
  children: React.ReactNode;
}): JSX.Element => {
  const inputRange: Array<number> = [-1, 0];
  const outputRange: Array<number> = [0, 0];

  inputRange.push(layoutY);
  outputRange.push(0);
  const collisionPoint = (nextSectionLayoutY || 0) - layoutHeight;
  if (collisionPoint >= layoutY) {
    inputRange.push(collisionPoint, collisionPoint + 1);
    outputRange.push(collisionPoint - layoutY, collisionPoint - layoutY);
  } else {
    inputRange.push(layoutY + 1);
    outputRange.push(1);
  }

  const translateY = scrollTopValue.interpolate({
    inputRange,
    outputRange,
  });

  const child = React.Children.only(children) as React.ReactElement;

  return (
    <Animated.View
      style={[
        child.props.style,
        {
          zIndex: 10,
          height: layoutHeight,
          transform: [{ translateY }],
        },
      ]}
    >
      {/*
       */}
      {React.cloneElement(child, {
        style: { flex: 1 },
      })}
    </Animated.View>
  );
};
