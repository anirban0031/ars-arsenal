var WebPack           = require('webpack')
var ExtractTextPlugin = require("extract-text-webpack-plugin")

module.exports = {
  debug   : true,
  devtool : 'source-map',

  entry: {
    'build/js/ars-arsenal' : './src/index.js'
  },

  output: {
    filename: '[name].js',
    libraryTarget: 'umd',
    library: 'ArsArsenal',
    path: '.',
  },

  externals: {
    'react': 'react',
    'react/addons': 'react/addons'
  },

  resolve: {
    extensions: ['', '.js', '.jsx', '.json', '.scss'],
    modulesDirectories: [ 'web_modules', 'node_modules', 'src']
  },

  plugins: [
    new ExtractTextPlugin("build/css/ars-arsenal.css"),
    new WebPack.DefinePlugin({
      '__DEV__' : process.env.NODE_ENV !== 'production'
    })
  ],

  module: {
    loaders: [
      {
        test    : /\.s(c|a)ss$/,
        loader  : ExtractTextPlugin.extract('style-loader', 'css-loader!autoprefixer-loader!sass-loader')
      },
      {
        test    : /\.jsx*$/,
        loader  : 'envify-loader'
      },
      {
        test    : /\.jsx*$/,
        exclude : /node_modules/,
        loader  : 'jsx-loader',
        query   : {
          harmony: true,
          stripTypes: true
        }
      },
      {
        test    : /\.json$/,
        loader  : 'json-loader'
      }
    ]
  }
}
