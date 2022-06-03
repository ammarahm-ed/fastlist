"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FastListItemRenderer = exports.FastListItemRendererH = void 0;
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
const FastListItemRendererH = ({ layoutHeight: height, children, }) => <react_native_1.View style={{ width: height }}>{children}</react_native_1.View>;
exports.FastListItemRendererH = FastListItemRendererH;
const FastListItemRenderer = ({ layoutHeight: height, children, }) => <react_native_1.View style={{ height }}>{children}</react_native_1.View>;
exports.FastListItemRenderer = FastListItemRenderer;
