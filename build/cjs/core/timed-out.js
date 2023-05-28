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
var timed_out_exports = {};
__export(timed_out_exports, {
  TimeoutError: () => TimeoutError,
  default: () => timedOut
});
module.exports = __toCommonJS(timed_out_exports);
var import_node_net = __toESM(require("node:net"));
var import_unhandle = __toESM(require("./utils/unhandle.js"));
const reentry = Symbol("reentry");
const noop = () => {
};
class TimeoutError extends Error {
  constructor(threshold, event) {
    super(`Timeout awaiting '${event}' for ${threshold}ms`);
    Object.defineProperty(this, "event", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: event
    });
    Object.defineProperty(this, "code", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    this.name = "TimeoutError";
    this.code = "ETIMEDOUT";
  }
}
function timedOut(request, delays, options) {
  if (reentry in request) {
    return noop;
  }
  request[reentry] = true;
  const cancelers = [];
  const { once, unhandleAll } = (0, import_unhandle.default)();
  const addTimeout = (delay, callback, event) => {
    var _a;
    const timeout = setTimeout(callback, delay, delay, event);
    (_a = timeout.unref) == null ? void 0 : _a.call(timeout);
    const cancel = () => {
      clearTimeout(timeout);
    };
    cancelers.push(cancel);
    return cancel;
  };
  const { host, hostname } = options;
  const timeoutHandler = (delay, event) => {
    request.destroy(new TimeoutError(delay, event));
  };
  const cancelTimeouts = () => {
    for (const cancel of cancelers) {
      cancel();
    }
    unhandleAll();
  };
  request.once("error", (error) => {
    cancelTimeouts();
    if (request.listenerCount("error") === 0) {
      throw error;
    }
  });
  if (delays.request !== void 0) {
    const cancelTimeout = addTimeout(delays.request, timeoutHandler, "request");
    once(request, "response", (response) => {
      once(response, "end", cancelTimeout);
    });
  }
  if (delays.socket !== void 0) {
    const { socket } = delays;
    const socketTimeoutHandler = () => {
      timeoutHandler(socket, "socket");
    };
    request.setTimeout(socket, socketTimeoutHandler);
    cancelers.push(() => {
      request.removeListener("timeout", socketTimeoutHandler);
    });
  }
  const hasLookup = delays.lookup !== void 0;
  const hasConnect = delays.connect !== void 0;
  const hasSecureConnect = delays.secureConnect !== void 0;
  const hasSend = delays.send !== void 0;
  if (hasLookup || hasConnect || hasSecureConnect || hasSend) {
    once(request, "socket", (socket) => {
      var _a;
      const { socketPath } = request;
      if (socket.connecting) {
        const hasPath = Boolean(socketPath != null ? socketPath : import_node_net.default.isIP((_a = hostname != null ? hostname : host) != null ? _a : "") !== 0);
        if (hasLookup && !hasPath && socket.address().address === void 0) {
          const cancelTimeout = addTimeout(delays.lookup, timeoutHandler, "lookup");
          once(socket, "lookup", cancelTimeout);
        }
        if (hasConnect) {
          const timeConnect = () => addTimeout(delays.connect, timeoutHandler, "connect");
          if (hasPath) {
            once(socket, "connect", timeConnect());
          } else {
            once(socket, "lookup", (error) => {
              if (error === null) {
                once(socket, "connect", timeConnect());
              }
            });
          }
        }
        if (hasSecureConnect && options.protocol === "https:") {
          once(socket, "connect", () => {
            const cancelTimeout = addTimeout(delays.secureConnect, timeoutHandler, "secureConnect");
            once(socket, "secureConnect", cancelTimeout);
          });
        }
      }
      if (hasSend) {
        const timeRequest = () => addTimeout(delays.send, timeoutHandler, "send");
        if (socket.connecting) {
          once(socket, "connect", () => {
            once(request, "upload-complete", timeRequest());
          });
        } else {
          once(request, "upload-complete", timeRequest());
        }
      }
    });
  }
  if (delays.response !== void 0) {
    once(request, "upload-complete", () => {
      const cancelTimeout = addTimeout(delays.response, timeoutHandler, "response");
      once(request, "response", cancelTimeout);
    });
  }
  if (delays.read !== void 0) {
    once(request, "response", (response) => {
      const cancelTimeout = addTimeout(delays.read, timeoutHandler, "read");
      once(response, "end", cancelTimeout);
    });
  }
  return cancelTimeouts;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  TimeoutError
});
//# sourceMappingURL=timed-out.js.map
