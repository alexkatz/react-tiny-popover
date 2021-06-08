"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Popover = exports.usePopover = exports.ArrowContainer = exports.useArrowContainer = void 0;
var react_1 = __importStar(require("react"));
var PopoverPortal_1 = require("./PopoverPortal");
var util_1 = require("./util");
var usePopover_1 = require("./usePopover");
Object.defineProperty(exports, "usePopover", { enumerable: true, get: function () { return usePopover_1.usePopover; } });
var useMemoizedArray_1 = require("./useMemoizedArray");
var useArrowContainer_1 = require("./useArrowContainer");
Object.defineProperty(exports, "useArrowContainer", { enumerable: true, get: function () { return useArrowContainer_1.useArrowContainer; } });
var ArrowContainer_1 = require("./ArrowContainer");
Object.defineProperty(exports, "ArrowContainer", { enumerable: true, get: function () { return ArrowContainer_1.ArrowContainer; } });
exports.Popover = react_1.forwardRef(function (_a, externalRef) {
    var isOpen = _a.isOpen, children = _a.children, content = _a.content, _b = _a.positions, externalPositions = _b === void 0 ? util_1.Constants.DEFAULT_POSITIONS : _b, _c = _a.align, align = _c === void 0 ? util_1.Constants.DEFAULT_ALIGN : _c, _d = _a.padding, padding = _d === void 0 ? 0 : _d, _e = _a.reposition, reposition = _e === void 0 ? true : _e, _f = _a.containerParent, containerParent = _f === void 0 ? window.document.body : _f, _g = _a.containerClassName, containerClassName = _g === void 0 ? 'react-tiny-popover-container' : _g, containerStyle = _a.containerStyle, contentLocation = _a.contentLocation, _h = _a.boundaryInset, boundaryInset = _h === void 0 ? 0 : _h, onClickOutside = _a.onClickOutside;
    var positions = useMemoizedArray_1.useMemoizedArray(externalPositions);
    // TODO: factor prevs out into a custom prevs hook
    var prevIsOpen = react_1.useRef(false);
    var prevPositions = react_1.useRef();
    var prevContentLocation = react_1.useRef();
    var prevReposition = react_1.useRef(reposition);
    var childRef = react_1.useRef();
    var _j = react_1.useState({
        align: align,
        nudgedLeft: 0,
        nudgedTop: 0,
        position: positions[0],
        padding: padding,
        childRect: util_1.Constants.EMPTY_CLIENT_RECT,
        popoverRect: util_1.Constants.EMPTY_CLIENT_RECT,
        parentRect: util_1.Constants.EMPTY_CLIENT_RECT,
        boundaryInset: boundaryInset,
    }), popoverState = _j[0], setPopoverState = _j[1];
    var onPositionPopover = react_1.useCallback(function (popoverState) { return setPopoverState(popoverState); }, []);
    var _k = usePopover_1.usePopover({
        childRef: childRef,
        containerClassName: containerClassName,
        containerParent: containerParent,
        contentLocation: contentLocation,
        positions: positions,
        align: align,
        padding: padding,
        boundaryInset: boundaryInset,
        reposition: reposition,
        onPositionPopover: onPositionPopover,
    }), positionPopover = _k[0], popoverRef = _k[1];
    react_1.useLayoutEffect(function () {
        var shouldUpdate = true;
        var updatePopover = function () {
            var _a, _b;
            if (isOpen && shouldUpdate && childRef.current && popoverRef.current) {
                var childRect = (_a = childRef.current) === null || _a === void 0 ? void 0 : _a.getBoundingClientRect();
                var popoverRect = (_b = popoverRef.current) === null || _b === void 0 ? void 0 : _b.getBoundingClientRect();
                if (!util_1.rectsAreEqual(childRect, {
                    top: popoverState.childRect.top,
                    left: popoverState.childRect.left,
                    width: popoverState.childRect.width,
                    height: popoverState.childRect.height,
                    bottom: popoverState.childRect.top + popoverState.childRect.height,
                    right: popoverState.childRect.left + popoverState.childRect.width,
                }) ||
                    popoverRect.width !== popoverState.popoverRect.width ||
                    popoverRect.height !== popoverState.popoverRect.height ||
                    popoverState.padding !== padding ||
                    popoverState.align !== align ||
                    positions !== prevPositions.current ||
                    contentLocation !== prevContentLocation.current ||
                    reposition !== prevReposition.current) {
                    positionPopover();
                }
                // TODO: factor prev checks out into the custom prevs hook
                if (positions !== prevPositions.current) {
                    prevPositions.current = positions;
                }
                if (contentLocation !== prevContentLocation.current) {
                    prevContentLocation.current = contentLocation;
                }
                if (reposition !== prevReposition.current) {
                    prevReposition.current = reposition;
                }
                if (shouldUpdate) {
                    window.requestAnimationFrame(updatePopover);
                }
            }
            prevIsOpen.current = isOpen;
        };
        window.requestAnimationFrame(updatePopover);
        return function () {
            shouldUpdate = false;
        };
    }, [
        align,
        contentLocation,
        isOpen,
        padding,
        popoverRef,
        popoverState.align,
        popoverState.childRect.height,
        popoverState.childRect.left,
        popoverState.childRect.top,
        popoverState.childRect.width,
        popoverState.padding,
        popoverState.popoverRect.height,
        popoverState.popoverRect.width,
        positionPopover,
        positions,
        reposition,
    ]);
    react_1.useEffect(function () {
        var popoverElement = popoverRef.current;
        Object.assign(popoverElement.style, containerStyle);
        return function () {
            Object.keys(containerStyle !== null && containerStyle !== void 0 ? containerStyle : {}).forEach(function (key) {
                return (popoverElement.style[key] = null);
            });
        };
    }, [containerStyle, isOpen, popoverRef]);
    var handleOnClickOutside = react_1.useCallback(function (e) {
        var _a, _b;
        if (isOpen &&
            !((_a = popoverRef === null || popoverRef === void 0 ? void 0 : popoverRef.current) === null || _a === void 0 ? void 0 : _a.contains(e.target)) &&
            !((_b = childRef === null || childRef === void 0 ? void 0 : childRef.current) === null || _b === void 0 ? void 0 : _b.contains(e.target))) {
            onClickOutside === null || onClickOutside === void 0 ? void 0 : onClickOutside(e);
        }
    }, [isOpen, onClickOutside, popoverRef]);
    var handleWindowResize = react_1.useCallback(function () {
        if (childRef === null || childRef === void 0 ? void 0 : childRef.current) {
            window.requestAnimationFrame(function () { return positionPopover(); });
        }
    }, [positionPopover]);
    react_1.useEffect(function () {
        window.addEventListener('click', handleOnClickOutside);
        window.addEventListener('resize', handleWindowResize);
        return function () {
            window.removeEventListener('click', handleOnClickOutside);
            window.removeEventListener('resize', handleWindowResize);
        };
    }, [handleOnClickOutside, handleWindowResize]);
    var handleRef = react_1.useCallback(function (node) {
        childRef.current = node;
        if (externalRef != null) {
            if (typeof externalRef === 'object') {
                externalRef.current = node;
            }
            else if (typeof externalRef === 'function') {
                externalRef(node);
            }
        }
    }, [externalRef]);
    var renderChild = function () {
        return react_1.default.cloneElement(children, {
            ref: handleRef,
        });
    };
    var renderPopover = function () {
        if (!isOpen)
            return null;
        return (react_1.default.createElement(PopoverPortal_1.PopoverPortal, { element: popoverRef.current, container: containerParent }, typeof content === 'function' ? content(popoverState) : content));
    };
    return (react_1.default.createElement(react_1.default.Fragment, null,
        renderChild(),
        renderPopover()));
});
//# sourceMappingURL=Popover.js.map