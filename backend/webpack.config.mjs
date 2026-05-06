import path from "path";
import webpack from "webpack";
import nodeExternals from "webpack-node-externals";

export default {
  target: "node", // It's a Node.js backend
  entry: "./index.js",
  output: {
    path: path.resolve("dist"),
    filename: "bundle.js",
    libraryTarget: "commonjs2",
  },
  externals: [nodeExternals()], // 🔥 ignore node_modules
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
    ],
  },
  resolve: {
    extensions: [".js", ".json", ".mjs"],
    fallback: {
      fs: false,
      net: false,
      tls: false,
      dns: false,
    },
  },
  plugins: [
    // 🔥 Fix dynamic require warnings from Express
    new webpack.ContextReplacementPlugin(/express\/lib/, false, /^$/),

    // Optional: Stop MongoDB optional deps from breaking
    new webpack.IgnorePlugin({
      resourceRegExp:
        /^snappy$|^aws4$|^kerberos$|^socks$|^gcp-metadata$|^@mongodb-js\/zstd$|^@aws-sdk\/credential-providers$|^mongodb-client-encryption$/,
    }),
  ],
  mode: "development", // or "production"
};
