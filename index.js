/* eslint-disable strict,lines-around-directive,global-require,prefer-rest-params */
'use strict';
const fs = require('fs');
const childProcess = require('child_process');

const oldSpawn = childProcess.spawn;

(function dev() {
  /**
   * Generate error from file
   * @type {*}
   */
  childProcess.spawn = function mySpawn() {
    console.log('spawn called');
    console.log(arguments);
    return oldSpawn.apply(this, arguments);
  };
  /**
   * Require App
   */
  const babelrc = fs.readFileSync('.babelrc');
  let config;
  try {
    config = JSON.parse(babelrc);
  } catch (err) {
    console.error('==> ERROR: Error parsing your .babelrc.');
    console.error(err);
  }

  require('babel-core/register')(config);
  //require("babel-polyfill");
  require('./devServer');
}());
