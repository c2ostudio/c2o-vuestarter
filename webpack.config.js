const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const NODE_ENV = process.env.NODE_ENV;

const setPath = function(folderName) {
  return path.join(__dirname, folderName);
}

const isProd = function() {
  return (process.env.NODE_ENV === 'production') ? true : false;
}

const buildingForLocal = () => {
  return (NODE_ENV === 'development');
};

// const setPublicPath = () => {
//   let env = NODE_ENV;
//   if (env === 'production') {
//     return 'https://c2o.studio/history/production/';
//   } else if (env === 'staging') {
//     return 'https://c2o.studio/history/staging/';
//   } else {
//     return '/';
//   }
// };

// Not extracting CSS because its not compatible yet.
// https://github.com/webpack-contrib/extract-text-webpack-plugin/issues/701
// Should be working soon.
const extractCSS = new ExtractTextPlugin({
  filename: "css/styles.[hash].css",
  disable: process.env.NODE_ENV === "development"
});


const extractHTML = new HtmlWebpackPlugin({
  title: 'History Search',
  filename: 'index.html',
  inject: true,
  template: setPath('/src/views/index.ejs'),
  environment: process.env.NODE_ENV,
  isLocalBuild: buildingForLocal(),
  imgPath: (!buildingForLocal()) ? 'assets' : 'src/assets'
});


const config = {
  optimization:{
    runtimeChunk: false,
    splitChunks: {
      chunks: "all",
    }
  },
  resolveLoader: {
    modules: [setPath('node_modules')]
  },
  mode: buildingForLocal() ? 'development' : 'production',
  devServer: {
    historyApiFallback: true,
    noInfo: false
  },
  plugins: [
    extractHTML,
    new webpack.DefinePlugin({
      'process.env': {
        isStaging: (NODE_ENV === 'development' || NODE_ENV === 'staging'),
        NODE_ENV: '"'+NODE_ENV+'"'
      }
    })
  ],
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            js: 'babel-loader'
          }
        }
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: [{
          loader: "babel-loader",
          options: { presets: ['es2015'] }
        }]
      },
      {
        test: /\.css$/,
        use: extractCSS.extract({
          fallback: "style-loader",
          use: ["css-loader", "autoprefixer-loader"]
        })
      },
      {
        test: /\.scss$/,
        use: !buildingForLocal() ?
             extractCSS.extract({
               fallback: "style-loader",
               use: ['css-loader', 'autoprefixer-loader', 'sass-loader']
            }) :
            [{
                loader: "style-loader"
              }, {
                loader: "css-loader"
              }, {
                loader: "sass-loader"
              }]
      },
      {
        test: /\.svg$/,
        loader: 'svg-sprite-loader'
      },
      {
        test: /\.(png|jpg|gif)$/,
        loader: 'file-loader',
        query: {
          name: '[name].[ext]?[hash]',
          useRelativePath: buildingForLocal()
        }
      }
    ]
  },
};
module.exports = config;
