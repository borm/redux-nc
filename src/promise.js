const promiseMiddleware = () => next => (action) => {
  const {
    promise, types,
    callback,
    ...rest
  } = action;

  if (!promise) {
    const payload = next(action);
    if (callback) {
      next(callback({ payload, error: false }));
    }
    return payload;
  }

  const { begin, success, failed } = types;
  next({
    type: begin, ...action, ...rest, waiting: true,
  });
  return promise.then(
    (payload) => {
      next({
        type: success, payload, ...rest, waiting: false,
      });
      if (callback) {
        next(callback({ payload, error: false }));
      }
      return Promise.resolve(payload);
    },
    (payload) => {
      next({
        type: failed, payload, ...rest, waiting: false,
      });
      if (callback) {
        next(callback({ payload, error: true }));
      }

      return Promise.reject(payload);
    },
  );
};

export default promiseMiddleware;
