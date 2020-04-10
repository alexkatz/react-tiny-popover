"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var util_1 = require("./util");
var ArrowContainer = function (_a) {
    var position = _a.position, children = _a.children, style = _a.style, _b = _a.arrowColor, arrowColor = _b === void 0 ? util_1.Constants.DEFAULT_ARROW_COLOR : _b, _c = _a.arrowSize, arrowSize = _c === void 0 ? 10 : _c, arrowStyle = _a.arrowStyle, popoverRect = _a.popoverRect, targetRect = _a.targetRect;
    return (React.createElement("div", { style: __assign({ paddingLeft: position === 'right' ? arrowSize : 0, paddingTop: position === 'bottom' ? arrowSize : 0, paddingBottom: position === 'top' ? arrowSize : 0, paddingRight: position === 'left' ? arrowSize : 0 }, style) },
        React.createElement("div", { style: __assign(__assign({ position: 'absolute' }, (function () {
                var arrowWidth = arrowSize * 2;
                var top = (targetRect.top - popoverRect.top) + (targetRect.height / 2) - (arrowWidth / 2);
                var left = (targetRect.left - popoverRect.left) + (targetRect.width / 2) - (arrowWidth / 2);
                left = left < 0 ? 0 : left;
                left = left + arrowWidth > popoverRect.width ? popoverRect.width - arrowWidth : left;
                top = top < 0 ? 0 : top;
                top = top + arrowWidth > popoverRect.height ? popoverRect.height - arrowWidth : top;
                switch (position) {
                    case 'right':
                        return {
                            borderTop: arrowSize + "px solid transparent",
                            borderBottom: arrowSize + "px solid transparent",
                            borderRight: arrowSize + "px solid " + arrowColor,
                            left: 0,
                            top: top,
                        };
                    case 'left':
                        return {
                            borderTop: arrowSize + "px solid transparent",
                            borderBottom: arrowSize + "px solid transparent",
                            borderLeft: arrowSize + "px solid " + arrowColor,
                            right: 0,
                            top: top,
                        };
                    case 'bottom':
                        return {
                            borderLeft: arrowSize + "px solid transparent",
                            borderRight: arrowSize + "px solid transparent",
                            borderBottom: arrowSize + "px solid " + arrowColor,
                            top: 0,
                            left: left,
                        };
                    case 'top':
                    default:
                        return {
                            borderLeft: arrowSize + "px solid transparent",
                            borderRight: arrowSize + "px solid transparent",
                            borderTop: arrowSize + "px solid " + arrowColor,
                            bottom: 0,
                            left: left,
                        };
                }
            })()), arrowStyle) }),
        children));
};
exports.ArrowContainer = ArrowContainer;
//# sourceMappingURL=ArrowContainer.js.map