"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FastListSectionRenderer = void 0;
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
const FastListSectionRenderer = ({ layoutY, layoutHeight, nextSectionLayoutY, scrollTopValue, children, }) => {
    const inputRange = [-1, 0];
    const outputRange = [0, 0];
    inputRange.push(layoutY);
    outputRange.push(0);
    const collisionPoint = (nextSectionLayoutY || 0) - layoutHeight;
    if (collisionPoint >= layoutY) {
        inputRange.push(collisionPoint, collisionPoint + 1);
        outputRange.push(collisionPoint - layoutY, collisionPoint - layoutY);
    }
    else {
        inputRange.push(layoutY + 1);
        outputRange.push(1);
    }
    const translateY = scrollTopValue.interpolate({
        inputRange,
        outputRange,
    });
    const child = react_1.default.Children.only(children);
    return (<react_native_1.Animated.View style={[
            child.props.style,
            {
                zIndex: 10,
                height: layoutHeight,
                transform: [{ translateY }],
            },
        ]}>
      {/*
         */}
      {react_1.default.cloneElement(child, {
            style: { flex: 1 },
        })}
    </react_native_1.Animated.View>);
};
exports.FastListSectionRenderer = FastListSectionRenderer;
