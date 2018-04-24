import webpack from 'webpack';
import UglifyJSPlugin from 'uglifyjs-webpack-plugin';
import { umd as config } from './config';

const { env, source, output } = config;
const isDev = env === 'development';

export default {
  mode: env,
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
  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(env),
      },
    }),
  ],
  optimization: {
    minimizer: [
      new UglifyJSPlugin({
        uglifyOptions: {
          output: {
            comments: false,
          },
          compress: {
            warnings: false,
            dead_code: true,
            drop_debugger: true,
            drop_console: true,
          },
        },
      }),
    ],
  },
};
