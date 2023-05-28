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
var options_exports = {};
__export(options_exports, {
  default: () => Options
});
module.exports = __toCommonJS(options_exports);
var import_node_process = __toESM(require("node:process"));
var import_node_util = require("node:util");
var import_node_tls = require("node:tls");
var import_node_http = __toESM(require("node:http"));
var import_node_https = __toESM(require("node:https"));
var import_is = __toESM(require("@esm2cjs/is"));
var import_lowercase_keys = __toESM(require("@esm2cjs/lowercase-keys"));
var import_cacheable_lookup = __toESM(require("@esm2cjs/cacheable-lookup"));
var import_http2_wrapper = __toESM(require("http2-wrapper"));
var import_form_data_encoder = require("@esm2cjs/form-data-encoder");
var import_parse_link_header = __toESM(require("./parse-link-header.js"));
const [major, minor] = import_node_process.default.versions.node.split(".").map(Number);
function validateSearchParameters(searchParameters) {
  for (const key in searchParameters) {
    const value = searchParameters[key];
    import_is.assert.any([import_is.default.string, import_is.default.number, import_is.default.boolean, import_is.default.null_, import_is.default.undefined], value);
  }
}
const globalCache = /* @__PURE__ */ new Map();
let globalDnsCache;
const getGlobalDnsCache = () => {
  if (globalDnsCache) {
    return globalDnsCache;
  }
  globalDnsCache = new import_cacheable_lookup.default();
  return globalDnsCache;
};
const defaultInternals = {
  request: void 0,
  agent: {
    http: void 0,
    https: void 0,
    http2: void 0
  },
  h2session: void 0,
  decompress: true,
  timeout: {
    connect: void 0,
    lookup: void 0,
    read: void 0,
    request: void 0,
    response: void 0,
    secureConnect: void 0,
    send: void 0,
    socket: void 0
  },
  prefixUrl: "",
  body: void 0,
  form: void 0,
  json: void 0,
  cookieJar: void 0,
  ignoreInvalidCookies: false,
  searchParams: void 0,
  dnsLookup: void 0,
  dnsCache: void 0,
  context: {},
  hooks: {
    init: [],
    beforeRequest: [],
    beforeError: [],
    beforeRedirect: [],
    beforeRetry: [],
    afterResponse: []
  },
  followRedirect: true,
  maxRedirects: 10,
  cache: void 0,
  throwHttpErrors: true,
  username: "",
  password: "",
  http2: false,
  allowGetBody: false,
  headers: {
    "user-agent": "got (https://github.com/sindresorhus/got)"
  },
  methodRewriting: false,
  dnsLookupIpVersion: void 0,
  parseJson: JSON.parse,
  stringifyJson: JSON.stringify,
  retry: {
    limit: 2,
    methods: [
      "GET",
      "PUT",
      "HEAD",
      "DELETE",
      "OPTIONS",
      "TRACE"
    ],
    statusCodes: [
      408,
      413,
      429,
      500,
      502,
      503,
      504,
      521,
      522,
      524
    ],
    errorCodes: [
      "ETIMEDOUT",
      "ECONNRESET",
      "EADDRINUSE",
      "ECONNREFUSED",
      "EPIPE",
      "ENOTFOUND",
      "ENETUNREACH",
      "EAI_AGAIN"
    ],
    maxRetryAfter: void 0,
    calculateDelay: ({ computedValue }) => computedValue,
    backoffLimit: Number.POSITIVE_INFINITY,
    noise: 100
  },
  localAddress: void 0,
  method: "GET",
  createConnection: void 0,
  cacheOptions: {
    shared: void 0,
    cacheHeuristic: void 0,
    immutableMinTimeToLive: void 0,
    ignoreCargoCult: void 0
  },
  https: {
    alpnProtocols: void 0,
    rejectUnauthorized: void 0,
    checkServerIdentity: void 0,
    certificateAuthority: void 0,
    key: void 0,
    certificate: void 0,
    passphrase: void 0,
    pfx: void 0,
    ciphers: void 0,
    honorCipherOrder: void 0,
    minVersion: void 0,
    maxVersion: void 0,
    signatureAlgorithms: void 0,
    tlsSessionLifetime: void 0,
    dhparam: void 0,
    ecdhCurve: void 0,
    certificateRevocationLists: void 0
  },
  encoding: void 0,
  resolveBodyOnly: false,
  isStream: false,
  responseType: "text",
  url: void 0,
  pagination: {
    transform(response) {
      if (response.request.options.responseType === "json") {
        return response.body;
      }
      return JSON.parse(response.body);
    },
    paginate({ response }) {
      const rawLinkHeader = response.headers.link;
      if (typeof rawLinkHeader !== "string" || rawLinkHeader.trim() === "") {
        return false;
      }
      const parsed = (0, import_parse_link_header.default)(rawLinkHeader);
      const next = parsed.find((entry) => entry.parameters.rel === "next" || entry.parameters.rel === '"next"');
      if (next) {
        return {
          url: new URL(next.reference, response.url)
        };
      }
      return false;
    },
    filter: () => true,
    shouldContinue: () => true,
    countLimit: Number.POSITIVE_INFINITY,
    backoff: 0,
    requestLimit: 1e4,
    stackAllItems: false
  },
  setHost: true,
  maxHeaderSize: void 0,
  signal: void 0,
  enableUnixSockets: false
};
const cloneInternals = (internals) => {
  const { hooks, retry } = internals;
  const result = {
    ...internals,
    context: { ...internals.context },
    cacheOptions: { ...internals.cacheOptions },
    https: { ...internals.https },
    agent: { ...internals.agent },
    headers: { ...internals.headers },
    retry: {
      ...retry,
      errorCodes: [...retry.errorCodes],
      methods: [...retry.methods],
      statusCodes: [...retry.statusCodes]
    },
    timeout: { ...internals.timeout },
    hooks: {
      init: [...hooks.init],
      beforeRequest: [...hooks.beforeRequest],
      beforeError: [...hooks.beforeError],
      beforeRedirect: [...hooks.beforeRedirect],
      beforeRetry: [...hooks.beforeRetry],
      afterResponse: [...hooks.afterResponse]
    },
    searchParams: internals.searchParams ? new URLSearchParams(internals.searchParams) : void 0,
    pagination: { ...internals.pagination }
  };
  if (result.url !== void 0) {
    result.prefixUrl = "";
  }
  return result;
};
const cloneRaw = (raw) => {
  const { hooks, retry } = raw;
  const result = { ...raw };
  if (import_is.default.object(raw.context)) {
    result.context = { ...raw.context };
  }
  if (import_is.default.object(raw.cacheOptions)) {
    result.cacheOptions = { ...raw.cacheOptions };
  }
  if (import_is.default.object(raw.https)) {
    result.https = { ...raw.https };
  }
  if (import_is.default.object(raw.cacheOptions)) {
    result.cacheOptions = { ...result.cacheOptions };
  }
  if (import_is.default.object(raw.agent)) {
    result.agent = { ...raw.agent };
  }
  if (import_is.default.object(raw.headers)) {
    result.headers = { ...raw.headers };
  }
  if (import_is.default.object(retry)) {
    result.retry = { ...retry };
    if (import_is.default.array(retry.errorCodes)) {
      result.retry.errorCodes = [...retry.errorCodes];
    }
    if (import_is.default.array(retry.methods)) {
      result.retry.methods = [...retry.methods];
    }
    if (import_is.default.array(retry.statusCodes)) {
      result.retry.statusCodes = [...retry.statusCodes];
    }
  }
  if (import_is.default.object(raw.timeout)) {
    result.timeout = { ...raw.timeout };
  }
  if (import_is.default.object(hooks)) {
    result.hooks = {
      ...hooks
    };
    if (import_is.default.array(hooks.init)) {
      result.hooks.init = [...hooks.init];
    }
    if (import_is.default.array(hooks.beforeRequest)) {
      result.hooks.beforeRequest = [...hooks.beforeRequest];
    }
    if (import_is.default.array(hooks.beforeError)) {
      result.hooks.beforeError = [...hooks.beforeError];
    }
    if (import_is.default.array(hooks.beforeRedirect)) {
      result.hooks.beforeRedirect = [...hooks.beforeRedirect];
    }
    if (import_is.default.array(hooks.beforeRetry)) {
      result.hooks.beforeRetry = [...hooks.beforeRetry];
    }
    if (import_is.default.array(hooks.afterResponse)) {
      result.hooks.afterResponse = [...hooks.afterResponse];
    }
  }
  if (import_is.default.object(raw.pagination)) {
    result.pagination = { ...raw.pagination };
  }
  return result;
};
const getHttp2TimeoutOption = (internals) => {
  const delays = [internals.timeout.socket, internals.timeout.connect, internals.timeout.lookup, internals.timeout.request, internals.timeout.secureConnect].filter((delay) => typeof delay === "number");
  if (delays.length > 0) {
    return Math.min(...delays);
  }
  return void 0;
};
const init = (options, withOptions, self) => {
  var _a;
  const initHooks = (_a = options.hooks) == null ? void 0 : _a.init;
  if (initHooks) {
    for (const hook of initHooks) {
      hook(withOptions, self);
    }
  }
};
class Options {
  constructor(input, options, defaults) {
    var _a, _b, _c;
    Object.defineProperty(this, "_unixOptions", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "_internals", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "_merging", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "_init", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    import_is.assert.any([import_is.default.string, import_is.default.urlInstance, import_is.default.object, import_is.default.undefined], input);
    import_is.assert.any([import_is.default.object, import_is.default.undefined], options);
    import_is.assert.any([import_is.default.object, import_is.default.undefined], defaults);
    if (input instanceof Options || options instanceof Options) {
      throw new TypeError("The defaults must be passed as the third argument");
    }
    this._internals = cloneInternals((_b = (_a = defaults == null ? void 0 : defaults._internals) != null ? _a : defaults) != null ? _b : defaultInternals);
    this._init = [...(_c = defaults == null ? void 0 : defaults._init) != null ? _c : []];
    this._merging = false;
    this._unixOptions = void 0;
    try {
      if (import_is.default.plainObject(input)) {
        try {
          this.merge(input);
          this.merge(options);
        } finally {
          this.url = input.url;
        }
      } else {
        try {
          this.merge(options);
        } finally {
          if ((options == null ? void 0 : options.url) !== void 0) {
            if (input === void 0) {
              this.url = options.url;
            } else {
              throw new TypeError("The `url` option is mutually exclusive with the `input` argument");
            }
          } else if (input !== void 0) {
            this.url = input;
          }
        }
      }
    } catch (error) {
      error.options = this;
      throw error;
    }
  }
  merge(options) {
    if (!options) {
      return;
    }
    if (options instanceof Options) {
      for (const init2 of options._init) {
        this.merge(init2);
      }
      return;
    }
    options = cloneRaw(options);
    init(this, options, this);
    init(options, options, this);
    this._merging = true;
    if ("isStream" in options) {
      this.isStream = options.isStream;
    }
    try {
      let push = false;
      for (const key in options) {
        if (key === "mutableDefaults" || key === "handlers") {
          continue;
        }
        if (key === "url") {
          continue;
        }
        if (!(key in this)) {
          throw new Error(`Unexpected option: ${key}`);
        }
        const value = options[key];
        if (value === void 0) {
          continue;
        }
        this[key] = value;
        push = true;
      }
      if (push) {
        this._init.push(options);
      }
    } finally {
      this._merging = false;
    }
  }
  get request() {
    return this._internals.request;
  }
  set request(value) {
    import_is.assert.any([import_is.default.function_, import_is.default.undefined], value);
    this._internals.request = value;
  }
  get agent() {
    return this._internals.agent;
  }
  set agent(value) {
    import_is.assert.plainObject(value);
    for (const key in value) {
      if (!(key in this._internals.agent)) {
        throw new TypeError(`Unexpected agent option: ${key}`);
      }
      import_is.assert.any([import_is.default.object, import_is.default.undefined], value[key]);
    }
    if (this._merging) {
      Object.assign(this._internals.agent, value);
    } else {
      this._internals.agent = { ...value };
    }
  }
  get h2session() {
    return this._internals.h2session;
  }
  set h2session(value) {
    this._internals.h2session = value;
  }
  get decompress() {
    return this._internals.decompress;
  }
  set decompress(value) {
    import_is.assert.boolean(value);
    this._internals.decompress = value;
  }
  get timeout() {
    return this._internals.timeout;
  }
  set timeout(value) {
    import_is.assert.plainObject(value);
    for (const key in value) {
      if (!(key in this._internals.timeout)) {
        throw new Error(`Unexpected timeout option: ${key}`);
      }
      import_is.assert.any([import_is.default.number, import_is.default.undefined], value[key]);
    }
    if (this._merging) {
      Object.assign(this._internals.timeout, value);
    } else {
      this._internals.timeout = { ...value };
    }
  }
  get prefixUrl() {
    return this._internals.prefixUrl;
  }
  set prefixUrl(value) {
    import_is.assert.any([import_is.default.string, import_is.default.urlInstance], value);
    if (value === "") {
      this._internals.prefixUrl = "";
      return;
    }
    value = value.toString();
    if (!value.endsWith("/")) {
      value += "/";
    }
    if (this._internals.prefixUrl && this._internals.url) {
      const { href } = this._internals.url;
      this._internals.url.href = value + href.slice(this._internals.prefixUrl.length);
    }
    this._internals.prefixUrl = value;
  }
  get body() {
    return this._internals.body;
  }
  set body(value) {
    import_is.assert.any([import_is.default.string, import_is.default.buffer, import_is.default.nodeStream, import_is.default.generator, import_is.default.asyncGenerator, import_form_data_encoder.isFormData, import_is.default.undefined], value);
    if (import_is.default.nodeStream(value)) {
      import_is.assert.truthy(value.readable);
    }
    if (value !== void 0) {
      import_is.assert.undefined(this._internals.form);
      import_is.assert.undefined(this._internals.json);
    }
    this._internals.body = value;
  }
  get form() {
    return this._internals.form;
  }
  set form(value) {
    import_is.assert.any([import_is.default.plainObject, import_is.default.undefined], value);
    if (value !== void 0) {
      import_is.assert.undefined(this._internals.body);
      import_is.assert.undefined(this._internals.json);
    }
    this._internals.form = value;
  }
  get json() {
    return this._internals.json;
  }
  set json(value) {
    if (value !== void 0) {
      import_is.assert.undefined(this._internals.body);
      import_is.assert.undefined(this._internals.form);
    }
    this._internals.json = value;
  }
  get url() {
    return this._internals.url;
  }
  set url(value) {
    import_is.assert.any([import_is.default.string, import_is.default.urlInstance, import_is.default.undefined], value);
    if (value === void 0) {
      this._internals.url = void 0;
      return;
    }
    if (import_is.default.string(value) && value.startsWith("/")) {
      throw new Error("`url` must not start with a slash");
    }
    const urlString = `${this.prefixUrl}${value.toString()}`;
    const url = new URL(urlString);
    this._internals.url = url;
    if (url.protocol === "unix:") {
      url.href = `http://unix${url.pathname}${url.search}`;
    }
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      const error = new Error(`Unsupported protocol: ${url.protocol}`);
      error.code = "ERR_UNSUPPORTED_PROTOCOL";
      throw error;
    }
    if (this._internals.username) {
      url.username = this._internals.username;
      this._internals.username = "";
    }
    if (this._internals.password) {
      url.password = this._internals.password;
      this._internals.password = "";
    }
    if (this._internals.searchParams) {
      url.search = this._internals.searchParams.toString();
      this._internals.searchParams = void 0;
    }
    if (url.hostname === "unix") {
      if (!this._internals.enableUnixSockets) {
        throw new Error("Using UNIX domain sockets but option `enableUnixSockets` is not enabled");
      }
      const matches = /(?<socketPath>.+?):(?<path>.+)/.exec(`${url.pathname}${url.search}`);
      if (matches == null ? void 0 : matches.groups) {
        const { socketPath, path } = matches.groups;
        this._unixOptions = {
          socketPath,
          path,
          host: ""
        };
      } else {
        this._unixOptions = void 0;
      }
      return;
    }
    this._unixOptions = void 0;
  }
  get cookieJar() {
    return this._internals.cookieJar;
  }
  set cookieJar(value) {
    import_is.assert.any([import_is.default.object, import_is.default.undefined], value);
    if (value === void 0) {
      this._internals.cookieJar = void 0;
      return;
    }
    let { setCookie, getCookieString } = value;
    import_is.assert.function_(setCookie);
    import_is.assert.function_(getCookieString);
    if (setCookie.length === 4 && getCookieString.length === 0) {
      setCookie = (0, import_node_util.promisify)(setCookie.bind(value));
      getCookieString = (0, import_node_util.promisify)(getCookieString.bind(value));
      this._internals.cookieJar = {
        setCookie,
        getCookieString
      };
    } else {
      this._internals.cookieJar = value;
    }
  }
  get signal() {
    return this._internals.signal;
  }
  set signal(value) {
    import_is.assert.object(value);
    this._internals.signal = value;
  }
  get ignoreInvalidCookies() {
    return this._internals.ignoreInvalidCookies;
  }
  set ignoreInvalidCookies(value) {
    import_is.assert.boolean(value);
    this._internals.ignoreInvalidCookies = value;
  }
  get searchParams() {
    if (this._internals.url) {
      return this._internals.url.searchParams;
    }
    if (this._internals.searchParams === void 0) {
      this._internals.searchParams = new URLSearchParams();
    }
    return this._internals.searchParams;
  }
  set searchParams(value) {
    import_is.assert.any([import_is.default.string, import_is.default.object, import_is.default.undefined], value);
    const url = this._internals.url;
    if (value === void 0) {
      this._internals.searchParams = void 0;
      if (url) {
        url.search = "";
      }
      return;
    }
    const searchParameters = this.searchParams;
    let updated;
    if (import_is.default.string(value)) {
      updated = new URLSearchParams(value);
    } else if (value instanceof URLSearchParams) {
      updated = value;
    } else {
      validateSearchParameters(value);
      updated = new URLSearchParams();
      for (const key in value) {
        const entry = value[key];
        if (entry === null) {
          updated.append(key, "");
        } else if (entry === void 0) {
          searchParameters.delete(key);
        } else {
          updated.append(key, entry);
        }
      }
    }
    if (this._merging) {
      for (const key of updated.keys()) {
        searchParameters.delete(key);
      }
      for (const [key, value2] of updated) {
        searchParameters.append(key, value2);
      }
    } else if (url) {
      url.search = searchParameters.toString();
    } else {
      this._internals.searchParams = searchParameters;
    }
  }
  get searchParameters() {
    throw new Error("The `searchParameters` option does not exist. Use `searchParams` instead.");
  }
  set searchParameters(_value) {
    throw new Error("The `searchParameters` option does not exist. Use `searchParams` instead.");
  }
  get dnsLookup() {
    return this._internals.dnsLookup;
  }
  set dnsLookup(value) {
    import_is.assert.any([import_is.default.function_, import_is.default.undefined], value);
    this._internals.dnsLookup = value;
  }
  get dnsCache() {
    return this._internals.dnsCache;
  }
  set dnsCache(value) {
    import_is.assert.any([import_is.default.object, import_is.default.boolean, import_is.default.undefined], value);
    if (value === true) {
      this._internals.dnsCache = getGlobalDnsCache();
    } else if (value === false) {
      this._internals.dnsCache = void 0;
    } else {
      this._internals.dnsCache = value;
    }
  }
  get context() {
    return this._internals.context;
  }
  set context(value) {
    import_is.assert.object(value);
    if (this._merging) {
      Object.assign(this._internals.context, value);
    } else {
      this._internals.context = { ...value };
    }
  }
  get hooks() {
    return this._internals.hooks;
  }
  set hooks(value) {
    import_is.assert.object(value);
    for (const knownHookEvent in value) {
      if (!(knownHookEvent in this._internals.hooks)) {
        throw new Error(`Unexpected hook event: ${knownHookEvent}`);
      }
      const typedKnownHookEvent = knownHookEvent;
      const hooks = value[typedKnownHookEvent];
      import_is.assert.any([import_is.default.array, import_is.default.undefined], hooks);
      if (hooks) {
        for (const hook of hooks) {
          import_is.assert.function_(hook);
        }
      }
      if (this._merging) {
        if (hooks) {
          this._internals.hooks[typedKnownHookEvent].push(...hooks);
        }
      } else {
        if (!hooks) {
          throw new Error(`Missing hook event: ${knownHookEvent}`);
        }
        this._internals.hooks[knownHookEvent] = [...hooks];
      }
    }
  }
  get followRedirect() {
    return this._internals.followRedirect;
  }
  set followRedirect(value) {
    import_is.assert.boolean(value);
    this._internals.followRedirect = value;
  }
  get followRedirects() {
    throw new TypeError("The `followRedirects` option does not exist. Use `followRedirect` instead.");
  }
  set followRedirects(_value) {
    throw new TypeError("The `followRedirects` option does not exist. Use `followRedirect` instead.");
  }
  get maxRedirects() {
    return this._internals.maxRedirects;
  }
  set maxRedirects(value) {
    import_is.assert.number(value);
    this._internals.maxRedirects = value;
  }
  get cache() {
    return this._internals.cache;
  }
  set cache(value) {
    import_is.assert.any([import_is.default.object, import_is.default.string, import_is.default.boolean, import_is.default.undefined], value);
    if (value === true) {
      this._internals.cache = globalCache;
    } else if (value === false) {
      this._internals.cache = void 0;
    } else {
      this._internals.cache = value;
    }
  }
  get throwHttpErrors() {
    return this._internals.throwHttpErrors;
  }
  set throwHttpErrors(value) {
    import_is.assert.boolean(value);
    this._internals.throwHttpErrors = value;
  }
  get username() {
    const url = this._internals.url;
    const value = url ? url.username : this._internals.username;
    return decodeURIComponent(value);
  }
  set username(value) {
    import_is.assert.string(value);
    const url = this._internals.url;
    const fixedValue = encodeURIComponent(value);
    if (url) {
      url.username = fixedValue;
    } else {
      this._internals.username = fixedValue;
    }
  }
  get password() {
    const url = this._internals.url;
    const value = url ? url.password : this._internals.password;
    return decodeURIComponent(value);
  }
  set password(value) {
    import_is.assert.string(value);
    const url = this._internals.url;
    const fixedValue = encodeURIComponent(value);
    if (url) {
      url.password = fixedValue;
    } else {
      this._internals.password = fixedValue;
    }
  }
  get http2() {
    return this._internals.http2;
  }
  set http2(value) {
    import_is.assert.boolean(value);
    this._internals.http2 = value;
  }
  get allowGetBody() {
    return this._internals.allowGetBody;
  }
  set allowGetBody(value) {
    import_is.assert.boolean(value);
    this._internals.allowGetBody = value;
  }
  get headers() {
    return this._internals.headers;
  }
  set headers(value) {
    import_is.assert.plainObject(value);
    if (this._merging) {
      Object.assign(this._internals.headers, (0, import_lowercase_keys.default)(value));
    } else {
      this._internals.headers = (0, import_lowercase_keys.default)(value);
    }
  }
  get methodRewriting() {
    return this._internals.methodRewriting;
  }
  set methodRewriting(value) {
    import_is.assert.boolean(value);
    this._internals.methodRewriting = value;
  }
  get dnsLookupIpVersion() {
    return this._internals.dnsLookupIpVersion;
  }
  set dnsLookupIpVersion(value) {
    if (value !== void 0 && value !== 4 && value !== 6) {
      throw new TypeError(`Invalid DNS lookup IP version: ${value}`);
    }
    this._internals.dnsLookupIpVersion = value;
  }
  get parseJson() {
    return this._internals.parseJson;
  }
  set parseJson(value) {
    import_is.assert.function_(value);
    this._internals.parseJson = value;
  }
  get stringifyJson() {
    return this._internals.stringifyJson;
  }
  set stringifyJson(value) {
    import_is.assert.function_(value);
    this._internals.stringifyJson = value;
  }
  get retry() {
    return this._internals.retry;
  }
  set retry(value) {
    import_is.assert.plainObject(value);
    import_is.assert.any([import_is.default.function_, import_is.default.undefined], value.calculateDelay);
    import_is.assert.any([import_is.default.number, import_is.default.undefined], value.maxRetryAfter);
    import_is.assert.any([import_is.default.number, import_is.default.undefined], value.limit);
    import_is.assert.any([import_is.default.array, import_is.default.undefined], value.methods);
    import_is.assert.any([import_is.default.array, import_is.default.undefined], value.statusCodes);
    import_is.assert.any([import_is.default.array, import_is.default.undefined], value.errorCodes);
    import_is.assert.any([import_is.default.number, import_is.default.undefined], value.noise);
    if (value.noise && Math.abs(value.noise) > 100) {
      throw new Error(`The maximum acceptable retry noise is +/- 100ms, got ${value.noise}`);
    }
    for (const key in value) {
      if (!(key in this._internals.retry)) {
        throw new Error(`Unexpected retry option: ${key}`);
      }
    }
    if (this._merging) {
      Object.assign(this._internals.retry, value);
    } else {
      this._internals.retry = { ...value };
    }
    const { retry } = this._internals;
    retry.methods = [...new Set(retry.methods.map((method) => method.toUpperCase()))];
    retry.statusCodes = [...new Set(retry.statusCodes)];
    retry.errorCodes = [...new Set(retry.errorCodes)];
  }
  get localAddress() {
    return this._internals.localAddress;
  }
  set localAddress(value) {
    import_is.assert.any([import_is.default.string, import_is.default.undefined], value);
    this._internals.localAddress = value;
  }
  get method() {
    return this._internals.method;
  }
  set method(value) {
    import_is.assert.string(value);
    this._internals.method = value.toUpperCase();
  }
  get createConnection() {
    return this._internals.createConnection;
  }
  set createConnection(value) {
    import_is.assert.any([import_is.default.function_, import_is.default.undefined], value);
    this._internals.createConnection = value;
  }
  get cacheOptions() {
    return this._internals.cacheOptions;
  }
  set cacheOptions(value) {
    import_is.assert.plainObject(value);
    import_is.assert.any([import_is.default.boolean, import_is.default.undefined], value.shared);
    import_is.assert.any([import_is.default.number, import_is.default.undefined], value.cacheHeuristic);
    import_is.assert.any([import_is.default.number, import_is.default.undefined], value.immutableMinTimeToLive);
    import_is.assert.any([import_is.default.boolean, import_is.default.undefined], value.ignoreCargoCult);
    for (const key in value) {
      if (!(key in this._internals.cacheOptions)) {
        throw new Error(`Cache option \`${key}\` does not exist`);
      }
    }
    if (this._merging) {
      Object.assign(this._internals.cacheOptions, value);
    } else {
      this._internals.cacheOptions = { ...value };
    }
  }
  get https() {
    return this._internals.https;
  }
  set https(value) {
    import_is.assert.plainObject(value);
    import_is.assert.any([import_is.default.boolean, import_is.default.undefined], value.rejectUnauthorized);
    import_is.assert.any([import_is.default.function_, import_is.default.undefined], value.checkServerIdentity);
    import_is.assert.any([import_is.default.string, import_is.default.object, import_is.default.array, import_is.default.undefined], value.certificateAuthority);
    import_is.assert.any([import_is.default.string, import_is.default.object, import_is.default.array, import_is.default.undefined], value.key);
    import_is.assert.any([import_is.default.string, import_is.default.object, import_is.default.array, import_is.default.undefined], value.certificate);
    import_is.assert.any([import_is.default.string, import_is.default.undefined], value.passphrase);
    import_is.assert.any([import_is.default.string, import_is.default.buffer, import_is.default.array, import_is.default.undefined], value.pfx);
    import_is.assert.any([import_is.default.array, import_is.default.undefined], value.alpnProtocols);
    import_is.assert.any([import_is.default.string, import_is.default.undefined], value.ciphers);
    import_is.assert.any([import_is.default.string, import_is.default.buffer, import_is.default.undefined], value.dhparam);
    import_is.assert.any([import_is.default.string, import_is.default.undefined], value.signatureAlgorithms);
    import_is.assert.any([import_is.default.string, import_is.default.undefined], value.minVersion);
    import_is.assert.any([import_is.default.string, import_is.default.undefined], value.maxVersion);
    import_is.assert.any([import_is.default.boolean, import_is.default.undefined], value.honorCipherOrder);
    import_is.assert.any([import_is.default.number, import_is.default.undefined], value.tlsSessionLifetime);
    import_is.assert.any([import_is.default.string, import_is.default.undefined], value.ecdhCurve);
    import_is.assert.any([import_is.default.string, import_is.default.buffer, import_is.default.array, import_is.default.undefined], value.certificateRevocationLists);
    for (const key in value) {
      if (!(key in this._internals.https)) {
        throw new Error(`HTTPS option \`${key}\` does not exist`);
      }
    }
    if (this._merging) {
      Object.assign(this._internals.https, value);
    } else {
      this._internals.https = { ...value };
    }
  }
  get encoding() {
    return this._internals.encoding;
  }
  set encoding(value) {
    if (value === null) {
      throw new TypeError("To get a Buffer, set `options.responseType` to `buffer` instead");
    }
    import_is.assert.any([import_is.default.string, import_is.default.undefined], value);
    this._internals.encoding = value;
  }
  get resolveBodyOnly() {
    return this._internals.resolveBodyOnly;
  }
  set resolveBodyOnly(value) {
    import_is.assert.boolean(value);
    this._internals.resolveBodyOnly = value;
  }
  get isStream() {
    return this._internals.isStream;
  }
  set isStream(value) {
    import_is.assert.boolean(value);
    this._internals.isStream = value;
  }
  get responseType() {
    return this._internals.responseType;
  }
  set responseType(value) {
    if (value === void 0) {
      this._internals.responseType = "text";
      return;
    }
    if (value !== "text" && value !== "buffer" && value !== "json") {
      throw new Error(`Invalid \`responseType\` option: ${value}`);
    }
    this._internals.responseType = value;
  }
  get pagination() {
    return this._internals.pagination;
  }
  set pagination(value) {
    import_is.assert.object(value);
    if (this._merging) {
      Object.assign(this._internals.pagination, value);
    } else {
      this._internals.pagination = value;
    }
  }
  get auth() {
    throw new Error("Parameter `auth` is deprecated. Use `username` / `password` instead.");
  }
  set auth(_value) {
    throw new Error("Parameter `auth` is deprecated. Use `username` / `password` instead.");
  }
  get setHost() {
    return this._internals.setHost;
  }
  set setHost(value) {
    import_is.assert.boolean(value);
    this._internals.setHost = value;
  }
  get maxHeaderSize() {
    return this._internals.maxHeaderSize;
  }
  set maxHeaderSize(value) {
    import_is.assert.any([import_is.default.number, import_is.default.undefined], value);
    this._internals.maxHeaderSize = value;
  }
  get enableUnixSockets() {
    return this._internals.enableUnixSockets;
  }
  set enableUnixSockets(value) {
    import_is.assert.boolean(value);
    this._internals.enableUnixSockets = value;
  }
  toJSON() {
    return { ...this._internals };
  }
  [Symbol.for("nodejs.util.inspect.custom")](_depth, options) {
    return (0, import_node_util.inspect)(this._internals, options);
  }
  createNativeRequestOptions() {
    var _a, _b, _c;
    const internals = this._internals;
    const url = internals.url;
    let agent;
    if (url.protocol === "https:") {
      agent = internals.http2 ? internals.agent : internals.agent.https;
    } else {
      agent = internals.agent.http;
    }
    const { https: https2 } = internals;
    let { pfx } = https2;
    if (import_is.default.array(pfx) && import_is.default.plainObject(pfx[0])) {
      pfx = pfx.map((object) => ({
        buf: object.buffer,
        passphrase: object.passphrase
      }));
    }
    return {
      ...internals.cacheOptions,
      ...this._unixOptions,
      ALPNProtocols: https2.alpnProtocols,
      ca: https2.certificateAuthority,
      cert: https2.certificate,
      key: https2.key,
      passphrase: https2.passphrase,
      pfx: https2.pfx,
      rejectUnauthorized: https2.rejectUnauthorized,
      checkServerIdentity: (_a = https2.checkServerIdentity) != null ? _a : import_node_tls.checkServerIdentity,
      ciphers: https2.ciphers,
      honorCipherOrder: https2.honorCipherOrder,
      minVersion: https2.minVersion,
      maxVersion: https2.maxVersion,
      sigalgs: https2.signatureAlgorithms,
      sessionTimeout: https2.tlsSessionLifetime,
      dhparam: https2.dhparam,
      ecdhCurve: https2.ecdhCurve,
      crl: https2.certificateRevocationLists,
      lookup: (_c = internals.dnsLookup) != null ? _c : (_b = internals.dnsCache) == null ? void 0 : _b.lookup,
      family: internals.dnsLookupIpVersion,
      agent,
      setHost: internals.setHost,
      method: internals.method,
      maxHeaderSize: internals.maxHeaderSize,
      localAddress: internals.localAddress,
      headers: internals.headers,
      createConnection: internals.createConnection,
      timeout: internals.http2 ? getHttp2TimeoutOption(internals) : void 0,
      h2session: internals.h2session
    };
  }
  getRequestFunction() {
    const url = this._internals.url;
    const { request } = this._internals;
    if (!request && url) {
      return this.getFallbackRequestFunction();
    }
    return request;
  }
  getFallbackRequestFunction() {
    const url = this._internals.url;
    if (!url) {
      return;
    }
    if (url.protocol === "https:") {
      if (this._internals.http2) {
        if (major < 15 || major === 15 && minor < 10) {
          const error = new Error("To use the `http2` option, install Node.js 15.10.0 or above");
          error.code = "EUNSUPPORTED";
          throw error;
        }
        return import_http2_wrapper.default.auto;
      }
      return import_node_https.default.request;
    }
    return import_node_http.default.request;
  }
  freeze() {
    const options = this._internals;
    Object.freeze(options);
    Object.freeze(options.hooks);
    Object.freeze(options.hooks.afterResponse);
    Object.freeze(options.hooks.beforeError);
    Object.freeze(options.hooks.beforeRedirect);
    Object.freeze(options.hooks.beforeRequest);
    Object.freeze(options.hooks.beforeRetry);
    Object.freeze(options.hooks.init);
    Object.freeze(options.https);
    Object.freeze(options.cacheOptions);
    Object.freeze(options.agent);
    Object.freeze(options.headers);
    Object.freeze(options.timeout);
    Object.freeze(options.retry);
    Object.freeze(options.retry.errorCodes);
    Object.freeze(options.retry.methods);
    Object.freeze(options.retry.statusCodes);
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=options.js.map
