"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var promiseMiddleware = function promiseMiddleware() {
  return function (next) {
    return function (action) {
      var promise = action.promise,
          types = action.types,
          callback = action.callback,
          rest = _objectWithoutProperties(action, ["promise", "types", "callback"]);

      if (!promise) {
        var payload = next(action);
        if (callback) {
          next(callback({ payload: payload, error: false }));
        }
        return payload;
      }

      var begin = types.begin,
          success = types.success,
          failed = types.failed;

      next(_extends({
        type: begin }, action, rest, { waiting: true
      }));
      return promise.then(function (payload) {
        next(_extends({
          type: success, payload: payload }, rest, { waiting: false
        }));
        if (callback) {
          next(callback({ payload: payload, error: false }));
        }
        return Promise.resolve(payload);
      }, function (payload) {
        next(_extends({
          type: failed, payload: payload }, rest, { waiting: false
        }));
        if (callback) {
          next(callback({ payload: payload, error: true }));
        }

        return Promise.reject(payload);
      });
    };
  };
};

exports.default = promiseMiddleware;