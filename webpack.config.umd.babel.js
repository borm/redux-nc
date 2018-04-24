import webpack from 'webpack';
import { umd as config } from './config';

const { env, source, output } = config;
const isDev = env === 'development';

export default {
  devtool: isDev ? 'source-map' : false,
  context: source,
  resolve: {
    modules: ['node_modules', source],
    extensions: ['.json', '.js'],
  },
  entry: './index.js',
  output: {
    path: output,
    filename: `umd/redux-nc${isDev ? '.js' : '.min.js'}`,
    library: 'ReduxNC',
    libraryTarget: 'umd',
    umdNamedDefine: true,
    // pathinfo: true, // isDev
  },
  module: {
    rules: [
      {
        test: /(\.js)$/,
        loader: 'babel-loader',
        exclude: /(node_modules)/,
      },
    ],
  },
  plugins: ((plugins) => {
    if (!isDev) {
      plugins.push(new webpack.optimize.UglifyJsPlugin({
        compressor: {
          pure_getters: true,
          unsafe: true,
          unsafe_comps: true,
          warnings: false,
        },
      }));
    }
    return plugins;
  })([
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(env),
      },
    }),
  ]),
};
