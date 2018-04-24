import { createActions, async } from '../../../src/index';

export default createActions('test', {
  sync() {
    return (dispatch, getState) => {
      const { test: { sync: value } } = getState();
      return value + 1;
    };
  },

  @async()
  async() {
    return (dispatch, getState) => {
      const { test: { async: value } } = getState();
      return new Promise(resolve => resolve(value + 1));
    };
  },
});
