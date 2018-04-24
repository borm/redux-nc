import test from 'modules/test/actions';
import { getActionIds } from '../src/index';

export const types = {
  test: getActionIds(test),
};

export { test };

export default {
  types,

  test,
};
