const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  entry: './src/server.ts',
  target: 'node',
  mode: 'production',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'app.js',
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node-modules/,
      },
    ],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'src', 'public'),
          to: path.resolve(__dirname, 'dist', 'public'),
        },
      ],
    }),
    new CleanWebpackPlugin(),
    new webpack.IgnorePlugin({
      resourceRegExp: /^(kerberos|snappy|mongodb-client-encryption|@mongodb-js\/zstd|@aws-sdk\/credential-providers|gcp-metadata|socks|aws4)$/,
    }),
  ],
};
