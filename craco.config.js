/* eslint-disable @typescript-eslint/no-var-requires */
const webpack = require('webpack')
const path = require('path')
const { whenDev, whenProd } = require('craco')
// const ENV = require('react-scripts/config/env')
// const {sentryWebpackPlugin} = require('@sentry/webpack-plugin')
// const WebpackBar = require('webpackbar')
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

// const {raw: env} = ENV() || {}
// const {REACT_APP_ENV, NODE_ENV} = env || {}

module.exports = {
  target: 'node',
  eslint: whenDev(() => ({
    enable: true,
    mode: 'file',
  })),
  typescript: whenDev(() => ({
    enableTypeChecking: true,
  })),
  webpack: {
    alias: {
      '@components': path.resolve(__dirname, 'src/components'),
      '@media': path.resolve(__dirname, 'src/_media'),
    },
    plugins: {
      add: [
        // new WebpackBar({profile: true}),
        // new BundleAnalyzerPlugin()
        new webpack.ProvidePlugin({
          Buffer: ['buffer', 'Buffer'],
          process: 'process',
        }),
      ],
    },
    // performance: {
    //   hints: 'warning',
    //   maxEntrypointSize: 50000, // in bytes, default 250k
    //   maxAssetSize: 100000, // in bytes
    // },
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          loader: 'babel-loader',
          include: path.resolve(__dirname, 'src'),
          exclude: /node_modules/,
        },
        {
          test: /\.tsx?$/,
          include: path.resolve(__dirname, 'src'),
          exclude: /node_modules/,
          use: [
            {
              loader: 'ts-loader',
              options: {
                transpileOnly: true,
              },
            },
          ],
        },
        {
          test: /\.(png|jpe?g|gif)$/i,
          include: path.resolve(__dirname, 'src'),
          exclude: /node_modules/,
          use: [
            {
              loader: 'file-loader',
            },
          ],
        },
      ],
    },

    configure: {
      resolve: {
        fallback: {
          path: require.resolve('path-browserify'),
          stream: require.resolve('stream-browserify'),
          crypto: require.resolve('crypto-browserify'),
          buffer: require.resolve('buffer'),
        },
      },
      ignoreWarnings: [/Failed to parse source map/],
      optimization: whenProd(() => ({
        // minimize: false,
        splitChunks: {
          chunks: 'all',
          minSize: 1,
          maxSize: 1000000,
          minRemainingSize: 0,
          minChunks: 1,
          cacheGroups: {
            default: false,
            vendors: false,
            vendor: {
              name: 'atask',
              chunks: 'all',
              priority: 10,
              // test: /node_modules/,
              reuseExistingChunk: false,
            },
          },
        },
      })),
    },
  },
}
