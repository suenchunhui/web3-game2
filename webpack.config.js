const path = require('path');

module.exports = {
  // context: __dirname,
  entry: "./js-hero/guitar_hero.js",
  // target: 'node',
  output: {
    // path: path.resolve(__dirname, 'lib'),
    path: path.resolve(__dirname, 'public'),
  	filename: "./lib/bundle.js"
  },
  // resolve: {
  //   extensions: ['.js']
  // },
  devtool: 'source-map',
};
