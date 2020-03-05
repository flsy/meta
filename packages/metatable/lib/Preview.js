"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
require("./App.css");
const MetaTable_1 = __importDefault(require("./components/MetaTable"));
const Preview = () => {
    return (react_1.default.createElement("div", null,
        react_1.default.createElement(MetaTable_1.default, null)));
};
exports.default = Preview;
