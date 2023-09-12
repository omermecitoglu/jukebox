const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const path = require("path");

module.exports = (env, argv) => ([{
  name: "client",
  entry: "./src/app/index.tsx",
  output: {
    filename: "index.js",
    path: path.resolve(__dirname, "build/client"),
  },
  target: "web",
  plugins: [
    new HtmlWebpackPlugin({
      title: "Jukebox",
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: "public", to: "." },
      ],
    }),
  ],
  optimization: {
    minimizer: [new TerserPlugin({
      extractComments: false,
    })],
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      /* {
        test: /\.js$/,
        // exclude: /node_modules/, //this is the line that caused the problem. Remove or comment it out.
        enforce: "pre",
        use: ["source-map-loader"],
      }, */
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
    port: 3000,
  },
}, {
  name: "server",
  entry: "./src/server.ts",
  output: {
    filename: "index.js",
    path: path.resolve(__dirname, "build"),
  },
  target: "node",
  externals: {
    "bufferutil": "bufferutil",
    "utf-8-validate": "utf-8-validate",
  },
  plugins: [
  ],
  optimization: {
    minimizer: [new TerserPlugin({
      extractComments: false,
    })],
  },
  module: {
    rules: [
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
}]);
