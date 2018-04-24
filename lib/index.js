'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createReducer = exports.getActionIds = exports.createActions = exports.promiseMiddleware = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.async = async;
exports.complete = complete;
exports.delay = delay;

var _lodash = require('lodash.map');

var _lodash2 = _interopRequireDefault(_lodash);

var _lodash3 = require('lodash.mapvalues');

var _lodash4 = _interopRequireDefault(_lodash3);

var _promise = require('./promise');

var _promise2 = _interopRequireDefault(_promise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

exports.promiseMiddleware = _promise2.default;

// Create actions that don't need constants :)

var createActions = exports.createActions = function createActions(prefix, actions) {
  var zipObject = {};

  /**
   * Pre filling zipObject for can using 'this' inside action
   * see payload = createAction => this.apply
   */
  (0, _lodash2.default)(actions, function (property, key) {
    var actionId = prefix.toUpperCase() + '__' + key.toUpperCase();

    zipObject[key] = function () {
      return {
        type: actionId,
        payload: null
      };
    };
  });

  /**
   * Fill zipObject with real payloads
   */
  (0, _lodash2.default)(actions, function (action, key) {
    var actionId = prefix.toUpperCase() + '__' + key.toUpperCase();

    var asyncTypes = ['BEGIN', 'SUCCESS', 'FAILED', 'COMPLETE'].reduce(function (types, type) {
      return _extends({}, types, _defineProperty({}, type.toLowerCase(), actionId + '_' + type));
    }, {});

    var callback = action.callback;


    var callbackAction = function callbackAction() {
      var _this = this;

      var dispatch = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function (props) {
        return props;
      };

      return function () {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        var payload = _this.apply(zipObject, args);

        if (typeof payload === 'function') {
          return function () {
            for (var _len2 = arguments.length, asyncArgs = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
              asyncArgs[_key2] = arguments[_key2];
            }

            return callbackAction.call.apply(callbackAction, [payload].concat(asyncArgs)).apply(undefined, asyncArgs);
          };
        }
        return dispatch({
          type: asyncTypes.complete,
          payload: payload
        });
      };
    };

    var createAction = function createAction() {
      var _this2 = this;

      var dispatch = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function (props) {
        return props;
      };

      return function () {
        for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
          args[_key3] = arguments[_key3];
        }

        var payload = _this2.apply.apply(_this2, [zipObject].concat(args));
        if (payload instanceof Promise) {
          /**
           * Promise (async)
           */
          return dispatch({
            args: Array.prototype.slice.call(args),
            types: asyncTypes,
            promise: payload,
            callback: callback ? callbackAction.call(callback) : false
          });
        } else if (typeof payload === 'function') {
          return function () {
            for (var _len4 = arguments.length, asyncArgs = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
              asyncArgs[_key4] = arguments[_key4];
            }

            return createAction.call.apply(createAction, [payload].concat(asyncArgs))(asyncArgs);
          };
        }
        /**
         * Object (sync)
         */
        return dispatch({
          args: Array.prototype.slice.call(args),
          type: actionId,
          payload: payload,
          callback: callback ? callbackAction.call(callback) : false
        });
      };
    };

    var actionCreator = function actionCreator() {
      for (var _len5 = arguments.length, args = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
        args[_key5] = arguments[_key5];
      }

      return createAction.call(action)(args);
    };

    /**
     * used async?
     */
    if (action.async === true) {
      actionCreator.id = asyncTypes;
    } else {
      var prototype = actionId.constructor.prototype;

      if (!Object.prototype.hasOwnProperty.call(prototype, 'complete')) {
        Object.defineProperty(prototype, 'complete', {
          get: function get() {
            return asyncTypes.complete;
          }
        });
      }
      actionCreator.id = actionId;
    }

    zipObject[key] = actionCreator;
  });

  return zipObject;
};

function async() {
  return function (target, name, descriptor) {
    // eslint-disable-next-line no-param-reassign
    descriptor.value.async = true;
    return descriptor;
  };
}

function complete(callback) {
  return function (target, name, descriptor) {
    // eslint-disable-next-line no-param-reassign
    descriptor.value.callback = callback;
    return descriptor;
  };
}

// Get action ids from actions created with `createActions`
var getActionIds = exports.getActionIds = function getActionIds(actionCreators) {
  return (0, _lodash4.default)(actionCreators, function (value) {
    return value.id;
  });
};

// Replace switch statements in stores (taken from the Redux README)
var createReducer = exports.createReducer = function createReducer(initialState, handlers) {
  return function () {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
    var action = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    if (Object.prototype.hasOwnProperty.call(handlers, action.type)) {
      return handlers[action.type](state, action);
    }
    return state;
  };
};

function delay(ms) {
  var timeout = void 0;
  return new Promise(function (resolve) {
    return setTimeout(function () {
      resolve();
      clearTimeout(timeout);
    }, ms);
  });
}