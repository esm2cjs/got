"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var options_to_url_exports = {};
__export(options_to_url_exports, {
  default: () => optionsToUrl
});
module.exports = __toCommonJS(options_to_url_exports);
var import_node_url = require("node:url");
const keys = [
  "protocol",
  "host",
  "hostname",
  "port",
  "pathname",
  "search"
];
function optionsToUrl(origin, options) {
  var _a, _b;
  if (options.path) {
    if (options.pathname) {
      throw new TypeError("Parameters `path` and `pathname` are mutually exclusive.");
    }
    if (options.search) {
      throw new TypeError("Parameters `path` and `search` are mutually exclusive.");
    }
    if (options.searchParams) {
      throw new TypeError("Parameters `path` and `searchParams` are mutually exclusive.");
    }
  }
  if (options.search && options.searchParams) {
    throw new TypeError("Parameters `search` and `searchParams` are mutually exclusive.");
  }
  if (!origin) {
    if (!options.protocol) {
      throw new TypeError("No URL protocol specified");
    }
    origin = `${options.protocol}//${(_b = (_a = options.hostname) != null ? _a : options.host) != null ? _b : ""}`;
  }
  const url = new import_node_url.URL(origin);
  if (options.path) {
    const searchIndex = options.path.indexOf("?");
    if (searchIndex === -1) {
      options.pathname = options.path;
    } else {
      options.pathname = options.path.slice(0, searchIndex);
      options.search = options.path.slice(searchIndex + 1);
    }
    delete options.path;
  }
  for (const key of keys) {
    if (options[key]) {
      url[key] = options[key].toString();
    }
  }
  return url;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=options-to-url.js.map
