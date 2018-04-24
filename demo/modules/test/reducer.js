import { types } from 'actions';

import { createReducer } from '../../../src/index';

export default createReducer({
  sync: 0,
  async: 0,
}, {
  [types.test.sync]: (state, action) => ({
    ...state,
    sync: action.payload,
  }),

  [types.test.async.success]: (state, action) => ({
    ...state,
    async: action.payload,
  }),
});
