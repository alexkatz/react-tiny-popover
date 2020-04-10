"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var react_dom_1 = require("react-dom");
var PopoverPortal = /** @class */ (function (_super) {
    __extends(PopoverPortal, _super);
    function PopoverPortal() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PopoverPortal.prototype.componentDidMount = function () {
        this.props.container.appendChild(this.props.element);
    };
    PopoverPortal.prototype.componentWillUnmount = function () {
        this.props.container.removeChild(this.props.element);
    };
    PopoverPortal.prototype.componentDidUpdate = function (prevProps) {
        var prevContainer = prevProps.container;
        var _a = this.props, container = _a.container, element = _a.element;
        if (prevContainer !== container) {
            prevContainer.removeChild(element);
            container.appendChild(element);
        }
    };
    PopoverPortal.prototype.render = function () {
        return react_dom_1.createPortal(this.props.children, this.props.element);
    };
    return PopoverPortal;
}(React.PureComponent));
exports.PopoverPortal = PopoverPortal;
//# sourceMappingURL=PopoverPortal.js.map