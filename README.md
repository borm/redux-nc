Redux no constants
=========

A small library for working with redux without constants


## Installation

* npm: 
  `npm i -S redux-nc`

## Basic usage

1) First you need apply promise middleware

    ```
    import { promiseMiddleware } from 'redux-nc';

    applyMiddleware(..., promiseMiddleware);
    ``` 
    
2) Create the first action creator:

    ```
    import { createActions } from 'redux-nc';

    export default createActions('UNIQ_ACTIONS_NAME', {
      test: (...args) => true,
    });
    ```

3) Create reducer:

    ```
    import { createReducer, getActionIds } from 'redux-nc';
    import actions from 'actions';
    
    const types = getActionIds(actions);
    export default createReducer({
      test: false,
    }, {
      [types.test]: (state, action) => action.payload,
    });
    ```

4) Create the first async action creator:

    ```
    import { createActions, async } from 'redux-nc';

    export default createActions('UNIQ_ACTIONS_NAME', {
      @async()
      test(...args) {
        return (dispatch) => {
          dispatch(this.some(...ANY_DATA));
          return new Promise(resolve => resolve(true));
        }
      },
      
      some(...args) {
        return ...args;
      }
    });
    ```
    
4) Create reducer for async actions:

    ```
    import { createReducer, getActionIds } from 'redux-nc';
    import actions from 'actions';
    
    const types = getActionIds(actions);
    export default createReducer({
      test: false,
    }, {
      [types.test.begin]: (state, action) => action.payload,
      [types.test.success]: (state, action) => action.payload,
      [types.test.failed]: (state, action) => action.payload,
    });
    ```

5) Complete decorator:

    ```
    import { createActions, async, complete } from 'redux-nc';
    
    export default createActions('UNIQ_ACTIONS_NAME', {
      @async()
      /**
       * error: false/true - types.test.success / types.test.failed
       * payload: previus action result
       */
      @complete(({ error, payload }) => (dispatch) => {
        if (error) {
          
        } else {
          
        }
        // You can also use dispatch here
        // dispatch(this.some(...ANY_DATA));
        // NOTE: for use this, 
        // you should pass `function` not arrow func to @complete
      })
      test: () => new Promise(resolve => resolve(true)),
      
      some(...args) {
        return ...args;
      }
    });
    ```
