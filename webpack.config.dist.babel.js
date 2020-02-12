import webpack from 'webpack';
import baseConfig from './webpack.config.babel';

let config = Object.create(baseConfig);

config.entry = {
  'jquery.smartemoji.min.js': './src/js/jquery.smartemoji.js',
};

// noinspection JSUnresolvedFunction
config.plugins = [
  new webpack.ProvidePlugin({
    $: 'jquery',
    jQuery: 'jquery',
  }),
  new webpack.optimize.UglifyJsPlugin({
    sourceMap: true,
    compress: {
      unused: true,
      dead_code: true,
      warnings: false
    }
  })
];

// noinspection JSUnusedGlobalSymbols
export default config;
