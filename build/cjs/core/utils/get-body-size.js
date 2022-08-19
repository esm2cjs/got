"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var get_body_size_exports = {};
__export(get_body_size_exports, {
  default: () => getBodySize
});
module.exports = __toCommonJS(get_body_size_exports);
var import_node_buffer = require("node:buffer");
var import_node_util = require("node:util");
var import_is = __toESM(require("@esm2cjs/is"));
var import_is_form_data = __toESM(require("./is-form-data.js"));
async function getBodySize(body, headers) {
  if (headers && "content-length" in headers) {
    return Number(headers["content-length"]);
  }
  if (!body) {
    return 0;
  }
  if (import_is.default.string(body)) {
    return import_node_buffer.Buffer.byteLength(body);
  }
  if (import_is.default.buffer(body)) {
    return body.length;
  }
  if ((0, import_is_form_data.default)(body)) {
    return (0, import_node_util.promisify)(body.getLength.bind(body))();
  }
  return void 0;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=get-body-size.js.map
