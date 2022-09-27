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
var core_exports = {};
__export(core_exports, {
  default: () => Request
});
module.exports = __toCommonJS(core_exports);
var import_node_process = __toESM(require("node:process"));
var import_node_buffer = require("node:buffer");
var import_node_stream = require("node:stream");
var import_node_url = require("node:url");
var import_node_http = __toESM(require("node:http"));
var import_http_timer = __toESM(require("@esm2cjs/http-timer"));
var import_cacheable_request = __toESM(require("@esm2cjs/cacheable-request"));
var import_decompress_response = __toESM(require("decompress-response"));
var import_is = __toESM(require("@esm2cjs/is"));
var import_get_stream = require("get-stream");
var import_form_data_encoder = require("@esm2cjs/form-data-encoder");
var import_get_body_size = __toESM(require("./utils/get-body-size.js"));
var import_is_form_data = __toESM(require("./utils/is-form-data.js"));
var import_proxy_events = __toESM(require("./utils/proxy-events.js"));
var import_timed_out = __toESM(require("./timed-out.js"));
var import_url_to_options = __toESM(require("./utils/url-to-options.js"));
var import_weakable_map = __toESM(require("./utils/weakable-map.js"));
var import_calculate_retry_delay = __toESM(require("./calculate-retry-delay.js"));
var import_options = __toESM(require("./options.js"));
var import_response = require("./response.js");
var import_is_client_request = __toESM(require("./utils/is-client-request.js"));
var import_is_unix_socket_url = __toESM(require("./utils/is-unix-socket-url.js"));
var import_errors = require("./errors.js");
const supportsBrotli = import_is.default.string(import_node_process.default.versions.brotli);
const methodsWithoutBody = /* @__PURE__ */ new Set(["GET", "HEAD"]);
const cacheableStore = new import_weakable_map.default();
const redirectCodes = /* @__PURE__ */ new Set([300, 301, 302, 303, 304, 307, 308]);
const proxiedRequestEvents = [
  "socket",
  "connect",
  "continue",
  "information",
  "upgrade"
];
const noop = () => {
};
class Request extends import_node_stream.Duplex {
  constructor(url, options, defaults) {
    var _a, _b;
    super({
      autoDestroy: false,
      highWaterMark: 0
    });
    Object.defineProperty(this, "constructor", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "_noPipe", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "options", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "response", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "requestUrl", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "redirectUrls", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "retryCount", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "_stopRetry", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "_downloadedSize", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "_uploadedSize", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "_stopReading", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "_pipedServerResponses", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "_request", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "_responseSize", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "_bodySize", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "_unproxyEvents", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "_isFromCache", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "_cannotHaveBody", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "_triggerRead", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "_cancelTimeouts", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "_nativeResponse", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "_flushed", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "_aborted", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "_requestInitialized", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    this._downloadedSize = 0;
    this._uploadedSize = 0;
    this._stopReading = false;
    this._pipedServerResponses = /* @__PURE__ */ new Set();
    this._cannotHaveBody = false;
    this._unproxyEvents = noop;
    this._triggerRead = false;
    this._cancelTimeouts = noop;
    this._jobs = [];
    this._flushed = false;
    this._requestInitialized = false;
    this._aborted = false;
    this.redirectUrls = [];
    this.retryCount = 0;
    this._stopRetry = noop;
    this.on("pipe", (source) => {
      if (source.headers) {
        Object.assign(this.options.headers, source.headers);
      }
    });
    this.on("newListener", (event) => {
      if (event === "retry" && this.listenerCount("retry") > 0) {
        throw new Error("A retry listener has been attached already.");
      }
    });
    try {
      this.options = new import_options.default(url, options, defaults);
      if (!this.options.url) {
        if (this.options.prefixUrl === "") {
          throw new TypeError("Missing `url` property");
        }
        this.options.url = "";
      }
      this.requestUrl = this.options.url;
    } catch (error) {
      const { options: options2 } = error;
      if (options2) {
        this.options = options2;
      }
      this.flush = async () => {
        this.flush = async () => {
        };
        this.destroy(error);
      };
      return;
    }
    if ((_a = this.options.signal) == null ? void 0 : _a.aborted) {
      this.destroy(new import_errors.AbortError(this));
    }
    (_b = this.options.signal) == null ? void 0 : _b.addEventListener("abort", () => {
      this.destroy(new import_errors.AbortError(this));
    });
    const { body } = this.options;
    if (import_is.default.nodeStream(body)) {
      body.once("error", (error) => {
        if (this._flushed) {
          this._beforeError(new import_errors.UploadError(error, this));
        } else {
          this.flush = async () => {
            this.flush = async () => {
            };
            this._beforeError(new import_errors.UploadError(error, this));
          };
        }
      });
    }
  }
  async flush() {
    var _a;
    if (this._flushed) {
      return;
    }
    this._flushed = true;
    try {
      await this._finalizeBody();
      if (this.destroyed) {
        return;
      }
      await this._makeRequest();
      if (this.destroyed) {
        (_a = this._request) == null ? void 0 : _a.destroy();
        return;
      }
      for (const job of this._jobs) {
        job();
      }
      this._jobs.length = 0;
      this._requestInitialized = true;
    } catch (error) {
      this._beforeError(error);
    }
  }
  _beforeError(error) {
    if (this._stopReading) {
      return;
    }
    const { response, options } = this;
    const attemptCount = this.retryCount + (error.name === "RetryError" ? 0 : 1);
    this._stopReading = true;
    if (!(error instanceof import_errors.RequestError)) {
      error = new import_errors.RequestError(error.message, error, this);
    }
    const typedError = error;
    void (async () => {
      var _a, _b, _c, _d;
      if ((response == null ? void 0 : response.readable) && !response.rawBody && !((_b = (_a = this._request) == null ? void 0 : _a.socket) == null ? void 0 : _b.destroyed)) {
        response.setEncoding(this.readableEncoding);
        const success = await this._setRawBody(response);
        if (success) {
          response.body = response.rawBody.toString();
        }
      }
      if (this.listenerCount("retry") !== 0) {
        let backoff;
        try {
          let retryAfter;
          if (response && "retry-after" in response.headers) {
            retryAfter = Number(response.headers["retry-after"]);
            if (Number.isNaN(retryAfter)) {
              retryAfter = Date.parse(response.headers["retry-after"]) - Date.now();
              if (retryAfter <= 0) {
                retryAfter = 1;
              }
            } else {
              retryAfter *= 1e3;
            }
          }
          const retryOptions = options.retry;
          backoff = await retryOptions.calculateDelay({
            attemptCount,
            retryOptions,
            error: typedError,
            retryAfter,
            computedValue: (0, import_calculate_retry_delay.default)({
              attemptCount,
              retryOptions,
              error: typedError,
              retryAfter,
              computedValue: (_d = (_c = retryOptions.maxRetryAfter) != null ? _c : options.timeout.request) != null ? _d : Number.POSITIVE_INFINITY
            })
          });
        } catch (error_) {
          void this._error(new import_errors.RequestError(error_.message, error_, this));
          return;
        }
        if (backoff) {
          await new Promise((resolve) => {
            const timeout = setTimeout(resolve, backoff);
            this._stopRetry = () => {
              clearTimeout(timeout);
              resolve();
            };
          });
          if (this.destroyed) {
            return;
          }
          try {
            for (const hook of this.options.hooks.beforeRetry) {
              await hook(typedError, this.retryCount + 1);
            }
          } catch (error_) {
            void this._error(new import_errors.RequestError(error_.message, error, this));
            return;
          }
          if (this.destroyed) {
            return;
          }
          this.destroy();
          this.emit("retry", this.retryCount + 1, error, (updatedOptions) => {
            const request = new Request(options.url, updatedOptions, options);
            request.retryCount = this.retryCount + 1;
            import_node_process.default.nextTick(() => {
              void request.flush();
            });
            return request;
          });
          return;
        }
      }
      void this._error(typedError);
    })();
  }
  _read() {
    this._triggerRead = true;
    const { response } = this;
    if (response && !this._stopReading) {
      if (response.readableLength) {
        this._triggerRead = false;
      }
      let data;
      while ((data = response.read()) !== null) {
        this._downloadedSize += data.length;
        const progress = this.downloadProgress;
        if (progress.percent < 1) {
          this.emit("downloadProgress", progress);
        }
        this.push(data);
      }
    }
  }
  _write(chunk, encoding, callback) {
    const write = () => {
      this._writeRequest(chunk, encoding, callback);
    };
    if (this._requestInitialized) {
      write();
    } else {
      this._jobs.push(write);
    }
  }
  _final(callback) {
    const endRequest = () => {
      if (!this._request || this._request.destroyed) {
        callback();
        return;
      }
      this._request.end((error) => {
        var _a;
        if ((_a = this._request._writableState) == null ? void 0 : _a.errored) {
          return;
        }
        if (!error) {
          this._bodySize = this._uploadedSize;
          this.emit("uploadProgress", this.uploadProgress);
          this._request.emit("upload-complete");
        }
        callback(error);
      });
    };
    if (this._requestInitialized) {
      endRequest();
    } else {
      this._jobs.push(endRequest);
    }
  }
  _destroy(error, callback) {
    this._stopReading = true;
    this.flush = async () => {
    };
    this._stopRetry();
    this._cancelTimeouts();
    if (this.options) {
      const { body } = this.options;
      if (import_is.default.nodeStream(body)) {
        body.destroy();
      }
    }
    if (this._request) {
      this._request.destroy();
    }
    if (error !== null && !import_is.default.undefined(error) && !(error instanceof import_errors.RequestError)) {
      error = new import_errors.RequestError(error.message, error, this);
    }
    callback(error);
  }
  pipe(destination, options) {
    if (destination instanceof import_node_http.ServerResponse) {
      this._pipedServerResponses.add(destination);
    }
    return super.pipe(destination, options);
  }
  unpipe(destination) {
    if (destination instanceof import_node_http.ServerResponse) {
      this._pipedServerResponses.delete(destination);
    }
    super.unpipe(destination);
    return this;
  }
  async _finalizeBody() {
    const { options } = this;
    const { headers } = options;
    const isForm = !import_is.default.undefined(options.form);
    const isJSON = !import_is.default.undefined(options.json);
    const isBody = !import_is.default.undefined(options.body);
    const cannotHaveBody = methodsWithoutBody.has(options.method) && !(options.method === "GET" && options.allowGetBody);
    this._cannotHaveBody = cannotHaveBody;
    if (isForm || isJSON || isBody) {
      if (cannotHaveBody) {
        throw new TypeError(`The \`${options.method}\` method cannot be used with a body`);
      }
      const noContentType = !import_is.default.string(headers["content-type"]);
      if (isBody) {
        if ((0, import_form_data_encoder.isFormData)(options.body)) {
          const encoder = new import_form_data_encoder.FormDataEncoder(options.body);
          if (noContentType) {
            headers["content-type"] = encoder.headers["Content-Type"];
          }
          if ("Content-Length" in encoder.headers) {
            headers["content-length"] = encoder.headers["Content-Length"];
          }
          options.body = encoder.encode();
        }
        if ((0, import_is_form_data.default)(options.body) && noContentType) {
          headers["content-type"] = `multipart/form-data; boundary=${options.body.getBoundary()}`;
        }
      } else if (isForm) {
        if (noContentType) {
          headers["content-type"] = "application/x-www-form-urlencoded";
        }
        const { form } = options;
        options.form = void 0;
        options.body = new import_node_url.URLSearchParams(form).toString();
      } else {
        if (noContentType) {
          headers["content-type"] = "application/json";
        }
        const { json } = options;
        options.json = void 0;
        options.body = options.stringifyJson(json);
      }
      const uploadBodySize = await (0, import_get_body_size.default)(options.body, options.headers);
      if (import_is.default.undefined(headers["content-length"]) && import_is.default.undefined(headers["transfer-encoding"]) && !cannotHaveBody && !import_is.default.undefined(uploadBodySize)) {
        headers["content-length"] = String(uploadBodySize);
      }
    }
    if (options.responseType === "json" && !("accept" in options.headers)) {
      options.headers.accept = "application/json";
    }
    this._bodySize = Number(headers["content-length"]) || void 0;
  }
  async _onResponseBase(response) {
    var _a;
    if (this.isAborted) {
      return;
    }
    const { options } = this;
    const { url } = options;
    this._nativeResponse = response;
    if (options.decompress) {
      response = (0, import_decompress_response.default)(response);
    }
    const statusCode = response.statusCode;
    const typedResponse = response;
    typedResponse.statusMessage = typedResponse.statusMessage ? typedResponse.statusMessage : import_node_http.default.STATUS_CODES[statusCode];
    typedResponse.url = options.url.toString();
    typedResponse.requestUrl = this.requestUrl;
    typedResponse.redirectUrls = this.redirectUrls;
    typedResponse.request = this;
    typedResponse.isFromCache = (_a = this._nativeResponse.fromCache) != null ? _a : false;
    typedResponse.ip = this.ip;
    typedResponse.retryCount = this.retryCount;
    typedResponse.ok = (0, import_response.isResponseOk)(typedResponse);
    this._isFromCache = typedResponse.isFromCache;
    this._responseSize = Number(response.headers["content-length"]) || void 0;
    this.response = typedResponse;
    response.once("end", () => {
      this._responseSize = this._downloadedSize;
      this.emit("downloadProgress", this.downloadProgress);
    });
    response.once("error", (error) => {
      this._aborted = true;
      response.destroy();
      this._beforeError(new import_errors.ReadError(error, this));
    });
    response.once("aborted", () => {
      this._aborted = true;
      this._beforeError(new import_errors.ReadError({
        name: "Error",
        message: "The server aborted pending request",
        code: "ECONNRESET"
      }, this));
    });
    this.emit("downloadProgress", this.downloadProgress);
    const rawCookies = response.headers["set-cookie"];
    if (import_is.default.object(options.cookieJar) && rawCookies) {
      let promises = rawCookies.map(async (rawCookie) => options.cookieJar.setCookie(rawCookie, url.toString()));
      if (options.ignoreInvalidCookies) {
        promises = promises.map(async (promise) => {
          try {
            await promise;
          } catch {
          }
        });
      }
      try {
        await Promise.all(promises);
      } catch (error) {
        this._beforeError(error);
        return;
      }
    }
    if (this.isAborted) {
      return;
    }
    if (options.followRedirect && response.headers.location && redirectCodes.has(statusCode)) {
      response.resume();
      this._cancelTimeouts();
      this._unproxyEvents();
      if (this.redirectUrls.length >= options.maxRedirects) {
        this._beforeError(new import_errors.MaxRedirectsError(this));
        return;
      }
      this._request = void 0;
      const updatedOptions = new import_options.default(void 0, void 0, this.options);
      const serverRequestedGet = statusCode === 303 && updatedOptions.method !== "GET" && updatedOptions.method !== "HEAD";
      const canRewrite = statusCode !== 307 && statusCode !== 308;
      const userRequestedGet = updatedOptions.methodRewriting && canRewrite;
      if (serverRequestedGet || userRequestedGet) {
        updatedOptions.method = "GET";
        updatedOptions.body = void 0;
        updatedOptions.json = void 0;
        updatedOptions.form = void 0;
        delete updatedOptions.headers["content-length"];
      }
      try {
        const redirectBuffer = import_node_buffer.Buffer.from(response.headers.location, "binary").toString();
        const redirectUrl = new import_node_url.URL(redirectBuffer, url);
        if (!(0, import_is_unix_socket_url.default)(url) && (0, import_is_unix_socket_url.default)(redirectUrl)) {
          this._beforeError(new import_errors.RequestError("Cannot redirect to UNIX socket", {}, this));
          return;
        }
        if (redirectUrl.hostname !== url.hostname || redirectUrl.port !== url.port) {
          if ("host" in updatedOptions.headers) {
            delete updatedOptions.headers.host;
          }
          if ("cookie" in updatedOptions.headers) {
            delete updatedOptions.headers.cookie;
          }
          if ("authorization" in updatedOptions.headers) {
            delete updatedOptions.headers.authorization;
          }
          if (updatedOptions.username || updatedOptions.password) {
            updatedOptions.username = "";
            updatedOptions.password = "";
          }
        } else {
          redirectUrl.username = updatedOptions.username;
          redirectUrl.password = updatedOptions.password;
        }
        this.redirectUrls.push(redirectUrl);
        updatedOptions.prefixUrl = "";
        updatedOptions.url = redirectUrl;
        for (const hook of updatedOptions.hooks.beforeRedirect) {
          await hook(updatedOptions, typedResponse);
        }
        this.emit("redirect", updatedOptions, typedResponse);
        this.options = updatedOptions;
        await this._makeRequest();
      } catch (error) {
        this._beforeError(error);
        return;
      }
      return;
    }
    if (options.isStream && options.throwHttpErrors && !(0, import_response.isResponseOk)(typedResponse)) {
      this._beforeError(new import_errors.HTTPError(typedResponse));
      return;
    }
    response.on("readable", () => {
      if (this._triggerRead) {
        this._read();
      }
    });
    this.on("resume", () => {
      response.resume();
    });
    this.on("pause", () => {
      response.pause();
    });
    response.once("end", () => {
      this.push(null);
    });
    if (this._noPipe) {
      const success = await this._setRawBody();
      if (success) {
        this.emit("response", response);
      }
      return;
    }
    this.emit("response", response);
    for (const destination of this._pipedServerResponses) {
      if (destination.headersSent) {
        continue;
      }
      for (const key in response.headers) {
        const isAllowed = options.decompress ? key !== "content-encoding" : true;
        const value = response.headers[key];
        if (isAllowed) {
          destination.setHeader(key, value);
        }
      }
      destination.statusCode = statusCode;
    }
  }
  async _setRawBody(from = this) {
    if (from.readableEnded) {
      return false;
    }
    try {
      const rawBody = await (0, import_get_stream.buffer)(from);
      if (!this.isAborted) {
        this.response.rawBody = rawBody;
        return true;
      }
    } catch {
    }
    return false;
  }
  async _onResponse(response) {
    try {
      await this._onResponseBase(response);
    } catch (error) {
      this._beforeError(error);
    }
  }
  _onRequest(request) {
    const { options } = this;
    const { timeout, url } = options;
    (0, import_http_timer.default)(request);
    if (this.options.http2) {
      request.setTimeout(0);
    }
    this._cancelTimeouts = (0, import_timed_out.default)(request, timeout, url);
    const responseEventName = options.cache ? "cacheableResponse" : "response";
    request.once(responseEventName, (response) => {
      void this._onResponse(response);
    });
    request.once("error", (error) => {
      this._aborted = true;
      request.destroy();
      error = error instanceof import_timed_out.TimeoutError ? new import_errors.TimeoutError(error, this.timings, this) : new import_errors.RequestError(error.message, error, this);
      this._beforeError(error);
    });
    this._unproxyEvents = (0, import_proxy_events.default)(request, this, proxiedRequestEvents);
    this._request = request;
    this.emit("uploadProgress", this.uploadProgress);
    this._sendBody();
    this.emit("request", request);
  }
  async _asyncWrite(chunk) {
    return new Promise((resolve, reject) => {
      super.write(chunk, (error) => {
        if (error) {
          reject(error);
          return;
        }
        resolve();
      });
    });
  }
  _sendBody() {
    var _a;
    const { body } = this.options;
    const currentRequest = this.redirectUrls.length === 0 ? this : (_a = this._request) != null ? _a : this;
    if (import_is.default.nodeStream(body)) {
      body.pipe(currentRequest);
    } else if (import_is.default.generator(body) || import_is.default.asyncGenerator(body)) {
      (async () => {
        try {
          for await (const chunk of body) {
            await this._asyncWrite(chunk);
          }
          super.end();
        } catch (error) {
          this._beforeError(error);
        }
      })();
    } else if (!import_is.default.undefined(body)) {
      this._writeRequest(body, void 0, () => {
      });
      currentRequest.end();
    } else if (this._cannotHaveBody || this._noPipe) {
      currentRequest.end();
    }
  }
  _prepareCache(cache) {
    if (!cacheableStore.has(cache)) {
      const cacheableRequest = new import_cacheable_request.default((requestOptions, handler) => {
        const result = requestOptions._request(requestOptions, handler);
        if (import_is.default.promise(result)) {
          result.once = (event, handler2) => {
            if (event === "error") {
              (async () => {
                try {
                  await result;
                } catch (error) {
                  handler2(error);
                }
              })();
            } else if (event === "abort") {
              (async () => {
                try {
                  const request = await result;
                  request.once("abort", handler2);
                } catch {
                }
              })();
            } else {
              throw new Error(`Unknown HTTP2 promise event: ${event}`);
            }
            return result;
          };
        }
        return result;
      }, cache);
      cacheableStore.set(cache, cacheableRequest.request());
    }
  }
  async _createCacheableRequest(url, options) {
    return new Promise((resolve, reject) => {
      Object.assign(options, (0, import_url_to_options.default)(url));
      let request;
      const cacheRequest = cacheableStore.get(options.cache)(options, async (response) => {
        response._readableState.autoDestroy = false;
        if (request) {
          const fix = () => {
            if (response.req) {
              response.complete = response.req.res.complete;
            }
          };
          response.prependOnceListener("end", fix);
          fix();
          (await request).emit("cacheableResponse", response);
        }
        resolve(response);
      });
      cacheRequest.once("error", reject);
      cacheRequest.once("request", async (requestOrPromise) => {
        request = requestOrPromise;
        resolve(request);
      });
    });
  }
  async _makeRequest() {
    const { options } = this;
    const { headers, username, password } = options;
    const cookieJar = options.cookieJar;
    for (const key in headers) {
      if (import_is.default.undefined(headers[key])) {
        delete headers[key];
      } else if (import_is.default.null_(headers[key])) {
        throw new TypeError(`Use \`undefined\` instead of \`null\` to delete the \`${key}\` header`);
      }
    }
    if (options.decompress && import_is.default.undefined(headers["accept-encoding"])) {
      headers["accept-encoding"] = supportsBrotli ? "gzip, deflate, br" : "gzip, deflate";
    }
    if (username || password) {
      const credentials = import_node_buffer.Buffer.from(`${username}:${password}`).toString("base64");
      headers.authorization = `Basic ${credentials}`;
    }
    if (cookieJar) {
      const cookieString = await cookieJar.getCookieString(options.url.toString());
      if (import_is.default.nonEmptyString(cookieString)) {
        headers.cookie = cookieString;
      }
    }
    options.prefixUrl = "";
    let request;
    for (const hook of options.hooks.beforeRequest) {
      const result = await hook(options);
      if (!import_is.default.undefined(result)) {
        request = () => result;
        break;
      }
    }
    if (!request) {
      request = options.getRequestFunction();
    }
    const url = options.url;
    this._requestOptions = options.createNativeRequestOptions();
    if (options.cache) {
      this._requestOptions._request = request;
      this._requestOptions.cache = options.cache;
      this._requestOptions.body = options.body;
      this._prepareCache(options.cache);
    }
    const fn = options.cache ? this._createCacheableRequest : request;
    try {
      let requestOrResponse = fn(url, this._requestOptions);
      if (import_is.default.promise(requestOrResponse)) {
        requestOrResponse = await requestOrResponse;
      }
      if (import_is.default.undefined(requestOrResponse)) {
        requestOrResponse = options.getFallbackRequestFunction()(url, this._requestOptions);
        if (import_is.default.promise(requestOrResponse)) {
          requestOrResponse = await requestOrResponse;
        }
      }
      if ((0, import_is_client_request.default)(requestOrResponse)) {
        this._onRequest(requestOrResponse);
      } else if (this.writable) {
        this.once("finish", () => {
          void this._onResponse(requestOrResponse);
        });
        this._sendBody();
      } else {
        void this._onResponse(requestOrResponse);
      }
    } catch (error) {
      if (error instanceof import_cacheable_request.CacheError) {
        throw new import_errors.CacheError(error, this);
      }
      throw error;
    }
  }
  async _error(error) {
    try {
      if (error instanceof import_errors.HTTPError && !this.options.throwHttpErrors) {
      } else {
        for (const hook of this.options.hooks.beforeError) {
          error = await hook(error);
        }
      }
    } catch (error_) {
      error = new import_errors.RequestError(error_.message, error_, this);
    }
    this.destroy(error);
  }
  _writeRequest(chunk, encoding, callback) {
    if (!this._request || this._request.destroyed) {
      return;
    }
    this._request.write(chunk, encoding, (error) => {
      if (!error && !this._request.destroyed) {
        this._uploadedSize += import_node_buffer.Buffer.byteLength(chunk, encoding);
        const progress = this.uploadProgress;
        if (progress.percent < 1) {
          this.emit("uploadProgress", progress);
        }
      }
      callback(error);
    });
  }
  get ip() {
    var _a;
    return (_a = this.socket) == null ? void 0 : _a.remoteAddress;
  }
  get isAborted() {
    return this._aborted;
  }
  get socket() {
    var _a, _b;
    return (_b = (_a = this._request) == null ? void 0 : _a.socket) != null ? _b : void 0;
  }
  get downloadProgress() {
    let percent;
    if (this._responseSize) {
      percent = this._downloadedSize / this._responseSize;
    } else if (this._responseSize === this._downloadedSize) {
      percent = 1;
    } else {
      percent = 0;
    }
    return {
      percent,
      transferred: this._downloadedSize,
      total: this._responseSize
    };
  }
  get uploadProgress() {
    let percent;
    if (this._bodySize) {
      percent = this._uploadedSize / this._bodySize;
    } else if (this._bodySize === this._uploadedSize) {
      percent = 1;
    } else {
      percent = 0;
    }
    return {
      percent,
      transferred: this._uploadedSize,
      total: this._bodySize
    };
  }
  get timings() {
    var _a;
    return (_a = this._request) == null ? void 0 : _a.timings;
  }
  get isFromCache() {
    return this._isFromCache;
  }
  get reusedSocket() {
    var _a;
    return (_a = this._request) == null ? void 0 : _a.reusedSocket;
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=index.js.map
