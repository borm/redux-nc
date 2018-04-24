import fs from 'fs';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';

import { demo as config } from './config';

const babelRc = JSON.parse(fs.readFileSync('./.babelrc'));

const {
  env, host, port, source, output,
} = config;
const isDev = env === 'development';
const isProd = env === 'production';

const hot = [
  'react-hot-loader/patch',
  `webpack-dev-server/client?http://${host}:${port}`,
  'webpack/hot/only-dev-server',
];

export default {
  devtool: isProd ? false : 'source-map',
  devServer: {
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    hot: true,
    inline: true,
    port,
  },
  mode: env,
  target: 'web',
  context: source,
  resolve: {
    modules: [
      source,
      'node_modules',
    ],
    extensions: ['.js', '.jsx', '.scss'],
  },
  entry: {
    app: ((app) => {
      if (isDev) {
        return [...hot, ...app];
      }
      return app;
    })(['./app.js']),
  },
  output: {
    path: output,
    filename: 'dist/[name].js',
    publicPath: '/',
  },
  module: {
    rules: ((rules) => {
      if (isDev) {
        rules.push({
          test: /\.scss$/,
          use: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            // resolve-url-loader may be chained before sass-loader if necessary
            use: [
              {
                loader: 'css-loader',
                options: {
                  sourceMap: true,
                  importLoaders: 1,
                },
              }, {
                loader: 'sass-loader',
                options: {
                  sourceMap: true,
                  outputStyle: 'expanded',
                  includePaths: [source],
                },
              },
            ],
          }),
        });
      } else {
        rules.push({
          test: /\.scss$/,
          use: [
            { loader: 'style-loader' },
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1,
                minimize: true,
              },
            }, {
              loader: 'sass-loader',
              options: {
                sourceMap: false,
                outputStyle: 'compressed',
                includePaths: [source],
              },
            },
          ],
        });
      }

      return rules;
    })([{
      test: /\.(js|jsx)$/,
      exclude: [/node_modules/],
      use: [{
        loader: 'babel-loader',
        options: {
          presets: [...babelRc.presets, 'react'],
          plugins: ((plugins) => {
            if (!isProd) {
              plugins.push('react-hot-loader/babel');
            }
            return plugins;
          })([
            ...babelRc.plugins,
            'transform-class-properties',
            'transform-decorators-legacy',
            'transform-function-bind',
          ]),
        },
      }],
    }]),
  },
  plugins: ((plugins) => {
    if (isDev) {
      plugins.push(
        new webpack.HotModuleReplacementPlugin(),
        new ExtractTextPlugin('[name].css'),
      );
    } else {
      plugins.push(
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.optimize.AggressiveMergingPlugin(),
        new webpack.optimize.OccurrenceOrderPlugin(),
        /*new webpack.optimize.UglifyJsPlugin({
          compress: {
            // unused    : true,
            // dead_code : true,
            // warnings  : false,
            // drop_console: true,
            warnings: false,
            screw_ie8: true,
            conditionals: true,
            unused: true,
            comparisons: true,
            sequences: true,
            dead_code: true,
            evaluate: true,
            if_return: true,
            join_vars: true,
          },
          output: {
            comments: false,
          },
        }),*/
        new ExtractTextPlugin(`${output}/dist/[name].min.css`, {
          allChunks: true,
        }),
      );
    }

    return plugins;
  })([
    new HtmlWebpackPlugin({
      template: 'app.html',
      inject: 'body',
      filename: 'index.html',
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(env),
      },
    }),
  ]),
};
