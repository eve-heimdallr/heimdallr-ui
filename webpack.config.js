// Based on https://github.com/preboot/angular-webpack/blob/master/webpack.config.js

// Helper: root() is defined at the bottom
var path = require('path');
var webpack = require('webpack');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var AngularCompilerPlugin = require('@ngtools/webpack').AngularCompilerPlugin;

var ENV = process.env.ENV;
var isDeploy = ENV === 'deploy';
var isProd = (ENV === 'prod') || isDeploy;
var isDev = (ENV === 'dev') || (!isProd);
var envText = isDeploy ? 'deploy' : isProd ? 'prod' : 'dev'

console.debug('Resolved build environment: '  + envText);

// Webpack Plugins
var autoprefixer = require('autoprefixer');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = () => {
  var config = {};

  if (isDeploy) {
    config.mode='production';
    config.devtool='';
  } else if (isDev) {
    config.mode='development';
    config.devtool = 'eval-source-map';
  } else {
    config.mode='production';
    config.devtool = 'source-map';
  }

  config.entry = {
    app: './heimdallr/main.ts',
    polyfill: './heimdallr/polyfill.ts',
  };

  config.output = {
    path: root('dist'),
    filename: '[name].bundle.js',
  };

  config.resolve = {
    extensions: ['.ts', '.js', '.json', '.css', '.scss', '.html'],
    alias: [{
      alias: 'jquery',
      name: 'jquery/src/jquery',
    }],
  };

  var atlConfigFile = root('tsconfig.json');
  config.module = {
    rules: [
      {test: require.resolve("jquery"), loaders: ["expose-loader?$", "expose-loader?jQuery"] },
      //{test: /\.ts$/, loader: 'awesome-typescript-loader?configFileName=' + atlConfigFile},
      {test: /(?:\.ngfactory\.js|\.ngstyle\.js|\.ts)$/, loader: '@ngtools/webpack'},
      {test: /\.(css|scss|sass)$/, loaders: ['to-string-loader', 'css-loader', 'sass-loader']},
      {test: /\.html$/, loader: 'html-loader'},
      {test: /\.(gif|png|jpg|svg|woff|woff2|ttf|eot)$/, loader: 'file-loader'},
    ]
  };

  config.plugins = [
    new CopyWebpackPlugin([{
      from: root('heimdallr', 'static'),
      flatten: true,
    }]),
    new webpack.ProvidePlugin({
      jQuery: 'jquery',
      $: 'jquery',
      jquery: 'jquery',
    }),
    new webpack.LoaderOptionsPlugin({
      options: {
        postcss: [
          require('autoprefixer')(),
        ]
      }
    }),
    new webpack.DefinePlugin({
      'process.env': {
        ENV: JSON.stringify(envText),
        API_ROOT: JSON.stringify(process.env.API_ROOT),
      }
    }),
    new webpack.NoEmitOnErrorsPlugin(),
    new HtmlWebpackPlugin({
      template: root('heimdallr', 'index.html'),
      chunksSortMode: 'dependency',
    }),
    new AngularCompilerPlugin({
      tsConfigPath: root('tsconfig.json'),
      entryModule: root('heimdallr', 'app', 'app.module.ts') + '#AppModule',
      sourceMap: true,
    })
  ];

  config.optimization = {
    splitChunks: {
      chunks: "all",
      cacheGroups: {
          angular: { test: /[\\/]node_modules[\\/]@angular[\\/]/, name: "angular", priority: 10 },
          commons: { test: /[\\/]node_modules[\\/]/, name: "vendor", priority: 5 },
      }
    }
  };

  if (isProd) {
    config.optimization.minimize = true;
    config.optimization.minimizer = [new UglifyJsPlugin({
        sourceMap: true,
        uglifyOptions: {keep_fnames: true},
    })];
  }

  config.devServer = {
    contentBase: root('heimdallr'),
    historyApiFallback: true,
    quiet: false,
    stats: 'normal', // none (or false), errors-only, minimal, normal (or true) and verbose
    port: process.env.WEBPACK_DEV_SERVER_PORT || 8888,
  };

  return config
}


// Helper functions
function root(args) {
  args = Array.prototype.slice.call(arguments, 0);
  return path.join.apply(path, [__dirname].concat(args));
}
