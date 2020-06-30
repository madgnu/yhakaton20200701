const path = require("path");
const webpack = require("webpack");
const WebpackMd5Hash = require("webpack-md5-hash");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");

const isDev = process.env.NODE_ENV === "development";

module.exports = {
  entry: {
    main: "./src/pages/index/index.js",
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].[chunkhash].js",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: "babel-loader",
        },
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: [
          isDev ? "style-loader" : MiniCssExtractPlugin.loader,
          "css-loader",
          "postcss-loader",
        ],
      },
      {
        test: /\.(png|jp?g|gif|ico|svg)$/,
        use: [
          "file-loader?esModule=false&name=images/[name].[ext]",
          {
            loader: "image-webpack-loader",
            options: {
              mozjpeg: {
                progressive: true,
                quality: 65,
              },
              optipng: {
                enabled: false,
              },
              pngquant: {
                quality: [0.65, 0.9],
                speed: 4,
              },
              gifsicle: {
                interlaced: false,
              },
            },
          },
        ],
      },
      {
        test: /\.(eot|ttf|woff|woff2)$/i,
        loader: "file-loader?name=vendor/[name].[ext]",
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      NODE_ENV: JSON.stringify(process.env.NODE_ENV),
    }),
    new HtmlWebpackPlugin({
      inject: false,
      template: "./src/pages/index/index.html",
      filename: "index.html",
    }),
    new MiniCssExtractPlugin({
      filename: "style.[contenthash].css",
    }),
    new OptimizeCssAssetsPlugin({
      assetNameRegExp: /\.css$/g,
      cssProcessor: require("cssnano"),
      cssProcessorPluginOptions: {
        preset: ["default"],
      },
      canPrint: true,
    }),
    new WebpackMd5Hash(),
  ],
};
