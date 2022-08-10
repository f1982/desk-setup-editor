process.env.NODE_ENV = 'production'
const webpack = require('webpack')

const webpackConfigPro = require('react-scripts/config/webpack.config')('production');

const green = text => {
  return chalk.green.bold(text)
};

const chalk = require('chalk');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');

const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
webpackConfigPro.plugins.push(new BundleAnalyzerPlugin());
webpackConfigPro.plugins.push(
  new ProgressBarPlugin({
    format: `${green('analyzing... ')}${green('[:bar] ')}${green('[:percent] ')}${green('[:elapsed seconds] ')} - :msg`
  })
);

webpack(webpackConfigPro, (err, stats) => {
  if (err || stats.hasErrors()) {
    console.error(err)
  }
})
