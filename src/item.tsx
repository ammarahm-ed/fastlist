import React from "react";
import { View } from "react-native";

export const FastListItemRendererH = ({
  layoutHeight: height,
  children,
}: {
  layoutHeight: number;
  children?: React.ReactNode;
}): JSX.Element => <View style={{ width: height }}>{children}</View>;

export const FastListItemRenderer = ({
  layoutHeight: height,
  children,
}: {
  layoutHeight: number;
  children?: React.ReactNode;
}): JSX.Element => <View style={{ height }}>{children}</View>;
