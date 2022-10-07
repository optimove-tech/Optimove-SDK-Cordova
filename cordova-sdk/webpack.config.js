const path = require("path");

module.exports = {
  mode: "production",
  entry: "./src/core/index.ts",
  externals: {
    cordova: "cordova",
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  output: {
    path: path.resolve(__dirname, "www"),
    filename: "OptimoveCore.js",
    library: {
        type: "commonjs2"
    },
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        include: [path.resolve(__dirname, "src", "core")],
      },
    ],
  },
};
