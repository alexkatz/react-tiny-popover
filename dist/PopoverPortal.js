"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PopoverPortal = void 0;
var react_1 = require("react");
var react_dom_1 = require("react-dom");
var PopoverPortal = function (_a) {
    var container = _a.container, element = _a.element, children = _a.children;
    react_1.useLayoutEffect(function () {
        container.appendChild(element);
        return function () { return container.removeChild(element); };
    }, [container, element]);
    return react_dom_1.createPortal(children, element);
};
exports.PopoverPortal = PopoverPortal;
//# sourceMappingURL=PopoverPortal.js.map