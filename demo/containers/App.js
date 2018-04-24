import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { test as testActions } from 'actions';

@connect(
  state => ({
    test: state.test,
  }),
  dispatch => ({
    actions: {
      test: bindActionCreators(testActions, dispatch),
    },
  }),
)
class App extends Component {
  static propTypes = {
    test: PropTypes.shape({
      sync: PropTypes.number,
      async: PropTypes.number,
    }).isRequired,
    actions: PropTypes.shape({
      test: PropTypes.shape({
        sync: PropTypes.func,
        async: PropTypes.func,
      }),
    }).isRequired,
  };

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.onClickSync = ::this.onClickSync;
    this.onClickAsync = ::this.onClickAsync;
  }

  onClickSync() {
    this.props.actions.test.sync();
  }

  onClickAsync() {
    this.props.actions.test.async();
  }

  render() {
    console.log(this.props);
    const { test: { sync, async } } = this.props;
    return (
      <div>
        <button onClick={this.onClickSync}>
          Sync counter is {sync}
        </button>

        <button onClick={this.onClickAsync}>
          Async counter is {async}
        </button>
      </div>
    );
  }
}

export default App;
