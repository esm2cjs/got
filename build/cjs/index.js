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
var __reExport = (target, mod, secondTarget) => (__copyProps(target, mod, "default"), secondTarget && __copyProps(secondTarget, mod, "default"));
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var esm_exports = {};
__export(esm_exports, {
  Options: () => import_options2.default,
  calculateRetryDelay: () => import_calculate_retry_delay.default,
  create: () => import_create2.default,
  default: () => esm_default,
  got: () => got,
  parseLinkHeader: () => import_parse_link_header.default
});
module.exports = __toCommonJS(esm_exports);
var import_create = __toESM(require("./create.js"));
var import_options = __toESM(require("./core/options.js"));
var import_options2 = __toESM(require("./core/options.js"));
__reExport(esm_exports, require("./core/options.js"), module.exports);
__reExport(esm_exports, require("./core/response.js"), module.exports);
__reExport(esm_exports, require("./core/index.js"), module.exports);
__reExport(esm_exports, require("./core/errors.js"), module.exports);
var import_calculate_retry_delay = __toESM(require("./core/calculate-retry-delay.js"));
__reExport(esm_exports, require("./as-promise/types.js"), module.exports);
__reExport(esm_exports, require("./types.js"), module.exports);
var import_create2 = __toESM(require("./create.js"));
var import_parse_link_header = __toESM(require("./core/parse-link-header.js"));
const defaults = {
  options: new import_options.default(),
  handlers: [],
  mutableDefaults: false
};
const got = (0, import_create.default)(defaults);
var esm_default = got;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Options,
  calculateRetryDelay,
  create,
  got,
  parseLinkHeader
});
//# sourceMappingURL=index.js.map
