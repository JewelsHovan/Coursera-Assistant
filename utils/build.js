// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'production';
process.env.NODE_ENV = 'production';
process.env.ASSET_PATH = '/';

var webpack = require('webpack'),
  path = require('path'),
  fs = require('fs'),
  config = require('../webpack.config'),
  ZipPlugin = require('zip-webpack-plugin');

console.log('Starting build process...');

delete config.chromeExtensionBoilerplate;

config.mode = 'production';

var packageInfo = JSON.parse(fs.readFileSync('package.json', 'utf-8'));

console.log('Webpack config:', config.output);

webpack(config, function (err, stats) {
  if (err) {
    console.error('Build error:', err);
    throw err;
  }

  console.log('Build completed!');
  if (stats) {
    console.log(
      stats.toString({
        chunks: false,
        colors: true,
      })
    );
  }
});
