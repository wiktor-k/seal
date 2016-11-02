var production = process.env.NODE_ENV !== 'development';

var webpack = require("webpack");
var CleanWebpackPlugin = require('clean-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');

var defaultFileLoader = "file?name=assets/[path][name].[hash].[ext]";

var defaultOptions = {
  chunks: [],
  cache: true,
  inject: 'body'
};

var plugins = [
  new CleanWebpackPlugin(['dist']),
  new webpack.optimize.OccurrenceOrderPlugin(true),
  new CopyWebpackPlugin([{from: './entries'}], {ignore: ['*.ejs']}),
  new HtmlWebpackPlugin(Object.assign({}, defaultOptions, {
    filename: 'index.html',
    template: './entries/index.html.ejs',
    chunks: ['chat']
  }))
];

if (production) {
  plugins = plugins.concat([
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
  ]);
}

module.exports = {
  devtool: production ? "source-map" : false,
  context: __dirname + "/client",
  entry: {
    chat: ["babel-polyfill", "./modules/chat/chat"]
  },
  output: {
    path: __dirname + "/dist",
    filename: "assets/[name].[hash].js",
    chunkFilename: "assets/[name].[hash].js",
    publicPath: "/"
  },
  module: {
    loaders: [
      {
        test: /\.js$/i,
        exclude: /node_modules/,
        loader: "babel-loader!baggage?[file].scss"
      },
      {
        test: /\.scss$/i,
        loader: 'style!css!sass'
      },
      {
        test: /\.(jpe?g|png|gif|svg|ico)$/i,
        loaders: [
          defaultFileLoader,
          'image-webpack?bypassOnDebug&optimizationLevel=7&interlaced=false'
        ]
      },
      {
        test: /\.(ttf|eot|woff|woff2)$/i,
        loader: defaultFileLoader
      },
      {
        test: /\.ejs$/i,
        loader: 'html?attrs[]=img:src&attrs[]=link:href&attrs[]=square:src&attrs[]=wide:src&removeAttributeQuotes=false&conservativeCollapse=false'
      }
    ]
  },
  plugins: plugins
};
