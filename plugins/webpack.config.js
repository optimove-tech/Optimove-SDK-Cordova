const path = require("path");

module.exports = {
  mode: "development",
  entry: "./src/core/index.ts",
  externals: {
    cordova: "cordova",
    },
    resolve: {
        extensions: ['.ts','.js']
    },
  output: {
    path: path.resolve(__dirname, "www"),
    filename: "OptimoveCore.js",
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
