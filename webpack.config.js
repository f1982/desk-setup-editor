
module.exports = {
  module: {
    // loaders: [
    //   {
    //     test: /\.(glsl|vs|fs)$/,
    //     loader: 'ts-shader-loader'
    //   }
    // ],
    rules: {
      test: /\.(frag|vert|glsl)$/,
      // use: 'ts-shader-loader',
      use: [
        {
          loader: 'ts-shader-loader',
          options: {}
        }
      ]
    }
  }
}