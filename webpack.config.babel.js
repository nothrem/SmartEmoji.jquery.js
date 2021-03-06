import webpack from 'webpack';
import path from 'path';

// noinspection JSUnresolvedFunction, JSUnusedGlobalSymbols
export default {
  entry: {
    'jquery.smartemoji.js': './src/js/jquery.smartemoji.js',
  },
  externals: {
    jquery: 'jQuery',
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              [require.resolve('babel-preset-es2015'), { 'modules': false }]
            ]
          }
        },
      },
    ]
  },
  resolve: {
    modules: [
      'node_modules',
      'bower_components',
      'src/js',
    ],
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name]',
    libraryTarget: 'var',
    library: 'SmartEmoji'
  },
  devtool: 'source-map',
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
    }),
    new webpack.HotModuleReplacementPlugin()
  ],
};
