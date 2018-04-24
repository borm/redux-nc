import map from 'lodash.map';
import mapValues from 'lodash.mapvalues';
import promiseMiddleware from './promise';

export { promiseMiddleware };

// Create actions that don't need constants :)
export const createActions = (prefix, actions) => {
  const zipObject = {};

  /**
   * Pre filling zipObject for can using 'this' inside action
   * see payload = createAction => this.apply
   */
  map(actions, (property, key) => {
    const actionId = `${prefix.toUpperCase()}__${key.toUpperCase()}`;

    zipObject[key] = () => ({
      type: actionId,
      payload: null,
    });
  });

  /**
   * Fill zipObject with real payloads
   */
  map(actions, (action, key) => {
    const actionId = `${prefix.toUpperCase()}__${key.toUpperCase()}`;

    const asyncTypes = ['BEGIN', 'SUCCESS', 'FAILED', 'COMPLETE']
      .reduce((types, type) => ({
        ...types,
        [type.toLowerCase()]: `${actionId}_${type}`,
      }), {});

    const { callback } = action;

    const callbackAction = function callbackAction(dispatch = props => props) {
      return (...args) => {
        const payload = this.apply(zipObject, args);

        if (typeof payload === 'function') {
          return (...asyncArgs) => callbackAction
            .call(payload, ...asyncArgs)(...asyncArgs);
        }
        return dispatch({
          type: asyncTypes.complete,
          payload,
        });
      };
    };

    const createAction = function createAction(dispatch = props => props) {
      return (...args) => {
        const payload = this.apply(zipObject, ...args);
        if (payload instanceof Promise) {
          /**
           * Promise (async)
           */
          return dispatch({
            args: Array.prototype.slice.call(args),
            types: asyncTypes,
            promise: payload,
            callback: callback ? callbackAction.call(callback) : false,
          });
        } else if (typeof payload === 'function') {
          return (...asyncArgs) => createAction.call(payload, ...asyncArgs)(asyncArgs);
        }
        /**
         * Object (sync)
         */
        return dispatch({
          args: Array.prototype.slice.call(args),
          type: actionId,
          payload,
          callback: callback ? callbackAction.call(callback) : false,
        });
      };
    };

    const actionCreator = (...args) => createAction.call(action)(args);

    /**
     * used async?
     */
    if (action.async === true) {
      actionCreator.id = asyncTypes;
    } else {
      const { prototype } = actionId.constructor;
      if (!Object.prototype.hasOwnProperty.call(prototype, 'complete')) {
        Object.defineProperty(prototype, 'complete', {
          get() {
            return asyncTypes.complete;
          },
        });
      }
      actionCreator.id = actionId;
    }

    zipObject[key] = actionCreator;
  });

  return zipObject;
};

export function async() {
  return (target, name, descriptor) => {
    // eslint-disable-next-line no-param-reassign
    descriptor.value.async = true;
    return descriptor;
  };
}

export function complete(callback) {
  return (target, name, descriptor) => {
    // eslint-disable-next-line no-param-reassign
    descriptor.value.callback = callback;
    return descriptor;
  };
}

// Get action ids from actions created with `createActions`
export const getActionIds = actionCreators =>
  mapValues(actionCreators, value => value.id);

// Replace switch statements in stores (taken from the Redux README)
export const createReducer = (initialState, handlers) =>
  (state = initialState, action = {}) => {
    if (Object.prototype.hasOwnProperty.call(handlers, action.type)) {
      return handlers[action.type](state, action);
    }
    return state;
  };

export function delay(ms) {
  let timeout;
  return new Promise(resolve => setTimeout(() => {
    resolve();
    clearTimeout(timeout);
  }, ms));
}
