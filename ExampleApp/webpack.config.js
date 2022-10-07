const path = require("path");

module.exports = {
  mode: "production",
  entry: "./www/ts/index.ts",
  resolve: {
    extensions: [".ts"],
  },
  output: {
    path: path.resolve(__dirname, "www"),
    filename: "index.js",
    library: {
        type: "commonjs2"
    },
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        include: [path.resolve(__dirname, "www", "ts")],
      },
    ],
  },
};
