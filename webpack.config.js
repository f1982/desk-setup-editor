
module.exports = {
  module: {
    // loaders: [
    //   {
    //     test: /\.(glsl|vs|fs)$/,
    //     loader: 'ts-shader-loader'
    //   }
    // ],
    rules: [{
      test: /\.(frag|vert|glsl)$/,
      exclude: '/node_modules/',
      use: [
        'raw-loader',
        'ts-shader-loader'
      ]
    }]
  }
}