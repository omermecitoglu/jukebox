const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// const WorkboxPlugin = require("workbox-webpack-plugin");
const autoprefixer = require("autoprefixer")
const path = require("path");

const bundlePlugins = (mode) => {
  const plugins = [
    new HtmlWebpackPlugin({
      template: "src/index.html",
    }),
    new MiniCssExtractPlugin({
      filename: "style.css",
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: "public", to: "." },
      ],
    }),
  ];
  if (mode === "production") {
    /* plugins.push(new WorkboxPlugin.GenerateSW({
      clientsClaim: true,
      skipWaiting: true,
    })); */
  }
  return plugins;
};

module.exports = (env, argv) => ({
  entry: "./src/index.tsx",
  output: {
    filename: "index.js",
    path: path.resolve(__dirname, "build"),
  },
  target: "web",
  plugins: bundlePlugins(argv.mode),
  optimization: {
    minimizer: [new TerserPlugin({
      extractComments: false,
    })],
  },
  module: {
    rules: [
      {
        test: /\.(sa|sc|c)ss$/i,
        use: [
          argv.mode === "production" ? MiniCssExtractPlugin.loader : "style-loader",
          "css-loader",
          {
            // Loader for webpack to process CSS with PostCSS
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: [
                  autoprefixer
                ]
              }
            }
          },
          "sass-loader",
        ],
      },
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
    alias: {
      "~": path.resolve(__dirname, "src/"),
    },
  },
  devServer: {
    static: {
      directory: path.join(__dirname, "public"),
    },
    compress: true,
    allowedHosts: [
      "brave-rapidly-osprey.ngrok-free.app"
    ],
    port: 7700,
  },
});
