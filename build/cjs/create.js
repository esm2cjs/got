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
var create_exports = {};
__export(create_exports, {
  default: () => create_default
});
module.exports = __toCommonJS(create_exports);
var import_is = __toESM(require("@esm2cjs/is"));
var import_as_promise = __toESM(require("./as-promise/index.js"));
var import_core = __toESM(require("./core/index.js"));
var import_options = __toESM(require("./core/options.js"));
const delay = async (ms) => new Promise((resolve) => {
  setTimeout(resolve, ms);
});
const isGotInstance = (value) => import_is.default.function_(value);
const aliases = [
  "get",
  "post",
  "put",
  "patch",
  "head",
  "delete"
];
const create = (defaults) => {
  defaults = {
    options: new import_options.default(void 0, void 0, defaults.options),
    handlers: [...defaults.handlers],
    mutableDefaults: defaults.mutableDefaults
  };
  Object.defineProperty(defaults, "mutableDefaults", {
    enumerable: true,
    configurable: false,
    writable: false
  });
  const got = (url, options, defaultOptions = defaults.options) => {
    const request = new import_core.default(url, options, defaultOptions);
    let promise;
    const lastHandler = (normalized) => {
      request.options = normalized;
      request._noPipe = !normalized.isStream;
      void request.flush();
      if (normalized.isStream) {
        return request;
      }
      if (!promise) {
        promise = (0, import_as_promise.default)(request);
      }
      return promise;
    };
    let iteration = 0;
    const iterateHandlers = (newOptions) => {
      var _a;
      const handler = (_a = defaults.handlers[iteration++]) != null ? _a : lastHandler;
      const result = handler(newOptions, iterateHandlers);
      if (import_is.default.promise(result) && !request.options.isStream) {
        if (!promise) {
          promise = (0, import_as_promise.default)(request);
        }
        if (result !== promise) {
          const descriptors = Object.getOwnPropertyDescriptors(promise);
          for (const key in descriptors) {
            if (key in result) {
              delete descriptors[key];
            }
          }
          Object.defineProperties(result, descriptors);
          result.cancel = promise.cancel;
        }
      }
      return result;
    };
    return iterateHandlers(request.options);
  };
  got.extend = (...instancesOrOptions) => {
    const options = new import_options.default(void 0, void 0, defaults.options);
    const handlers = [...defaults.handlers];
    let mutableDefaults;
    for (const value of instancesOrOptions) {
      if (isGotInstance(value)) {
        options.merge(value.defaults.options);
        handlers.push(...value.defaults.handlers);
        mutableDefaults = value.defaults.mutableDefaults;
      } else {
        options.merge(value);
        if (value.handlers) {
          handlers.push(...value.handlers);
        }
        mutableDefaults = value.mutableDefaults;
      }
    }
    return create({
      options,
      handlers,
      mutableDefaults: Boolean(mutableDefaults)
    });
  };
  const paginateEach = async function* (url, options) {
    let normalizedOptions = new import_options.default(url, options, defaults.options);
    normalizedOptions.resolveBodyOnly = false;
    const { pagination } = normalizedOptions;
    import_is.assert.function_(pagination.transform);
    import_is.assert.function_(pagination.shouldContinue);
    import_is.assert.function_(pagination.filter);
    import_is.assert.function_(pagination.paginate);
    import_is.assert.number(pagination.countLimit);
    import_is.assert.number(pagination.requestLimit);
    import_is.assert.number(pagination.backoff);
    const allItems = [];
    let { countLimit } = pagination;
    let numberOfRequests = 0;
    while (numberOfRequests < pagination.requestLimit) {
      if (numberOfRequests !== 0) {
        await delay(pagination.backoff);
      }
      const response = await got(void 0, void 0, normalizedOptions);
      const parsed = await pagination.transform(response);
      const currentItems = [];
      import_is.assert.array(parsed);
      for (const item of parsed) {
        if (pagination.filter({ item, currentItems, allItems })) {
          if (!pagination.shouldContinue({ item, currentItems, allItems })) {
            return;
          }
          yield item;
          if (pagination.stackAllItems) {
            allItems.push(item);
          }
          currentItems.push(item);
          if (--countLimit <= 0) {
            return;
          }
        }
      }
      const optionsToMerge = pagination.paginate({
        response,
        currentItems,
        allItems
      });
      if (optionsToMerge === false) {
        return;
      }
      if (optionsToMerge === response.request.options) {
        normalizedOptions = response.request.options;
      } else {
        normalizedOptions.merge(optionsToMerge);
        import_is.assert.any([import_is.default.urlInstance, import_is.default.undefined], optionsToMerge.url);
        if (optionsToMerge.url !== void 0) {
          normalizedOptions.prefixUrl = "";
          normalizedOptions.url = optionsToMerge.url;
        }
      }
      numberOfRequests++;
    }
  };
  got.paginate = paginateEach;
  got.paginate.all = async (url, options) => {
    const results = [];
    for await (const item of paginateEach(url, options)) {
      results.push(item);
    }
    return results;
  };
  got.paginate.each = paginateEach;
  got.stream = (url, options) => got(url, { ...options, isStream: true });
  for (const method of aliases) {
    got[method] = (url, options) => got(url, { ...options, method });
    got.stream[method] = (url, options) => got(url, { ...options, method, isStream: true });
  }
  if (!defaults.mutableDefaults) {
    Object.freeze(defaults.handlers);
    defaults.options.freeze();
  }
  Object.defineProperty(got, "defaults", {
    value: defaults,
    writable: false,
    configurable: false,
    enumerable: true
  });
  return got;
};
var create_default = create;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=create.js.map
