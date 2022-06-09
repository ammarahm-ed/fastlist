import React from "react";
import { View } from "react-native";
export const FastListItemRendererH = ({ layoutHeight: height, children, }) => <View style={{ width: height }}>{children}</View>;
export const FastListItemRenderer = ({ layoutHeight: height, children, }) => <View style={{ height }}>{children}</View>;
