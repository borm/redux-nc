import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import reducers from './reducers';
import { promiseMiddleware } from '../src/index';

export default (initialState = {}) => {
  const store = createStore(
    reducers,
    initialState,
    composeWithDevTools(applyMiddleware(promiseMiddleware, thunk)),
  );

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('./reducers', () => {
      // eslint-disable-next-line global-require
      store.replaceReducer(require('./reducers').default);
    });
  }

  return store;
};
