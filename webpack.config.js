const path = require('path');
const webpack = require('webpack');

module.exports = (env, options) => {
  return {
    module: {
      rules: [
        {
          test: /\.ts|\.tsx$/,
          use: 'awesome-typescript-loader',
          include: __dirname
        }
      ],
    }
  }
};