var webpack = require('webpack')
var path = require('path')

var middleware = []
var plugins = [
  new webpack.DefinePlugin({
    'process.env': {'NODE_ENV': JSON.stringify(process.env.NODE_ENV)},
  }),
]

if (process.env.NODE_ENV === 'development') {
  middleware.push('webpack-hot-middleware/client')
  plugins.push(new webpack.HotModuleReplacementPlugin())
}

module.exports = {
  module: {
    loaders : [
      {
        test: /\.js$/,
        exclude: [/node_modules/],
        loaders: ['babel-loader', 'eslint-loader']
      }, {
        test: /\.css$/,
        loaders: ['style-loader', 'css-loader', 'postcss-loader']
      }, {
        test: /\.(jpe?g|png|gif|svg)$/i,
        loaders: [
          'file-loader?hash=sha512&digest=hex&name=[hash].[ext]',
          'image-webpack-loader?bypassOnDebug&optimizationLevel=10&interlaced=true'
        ]
      }
    ]
  },

  resolve: {
    alias: {
      App: path.resolve(__dirname, 'src', 'web'),
    }
  },

  entry: {
    main: middleware.concat(['./src/web/main.js'])
  },

  output: {
    path: path.resolve(__dirname, 'dist', 'web'),
    filename: '[name].bundle.js',
    publicPath: '/',
  },

  plugins: plugins,

  devTool: 'source-map',
}
