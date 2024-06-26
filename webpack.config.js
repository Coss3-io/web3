const path = require("path");
const fs = require("fs");
const glob = require("glob");
const { VueLoaderPlugin } = require("vue-loader");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const htmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlMinimizerPlugin = require("html-minimizer-webpack-plugin");
const autoprefixer = require("autoprefixer");
const { PurgeCSSPlugin } = require("purgecss-webpack-plugin");
const CircularDependencyPlugin = require("circular-dependency-plugin");
const { DefinePlugin } = require("webpack");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
const CompressionPlugin = require("compression-webpack-plugin");
const WorkboxPlugin = require("workbox-webpack-plugin");
const WebpackPwaManifest = require("webpack-pwa-manifest");
const PreloadWebpackPlugin = require("@vue/preload-webpack-plugin");

var config;
var optimize;
if ("DEV" in process.env) {
  config = require("./dev.config.js");
  optimize = [];
} else {
  config = require("./prod.config.js");
  optimize = [
    new WorkboxPlugin.GenerateSW({
      maximumFileSizeToCacheInBytes: 6097152,
      clientsClaim: true,
      skipWaiting: true,
      navigateFallback: "./index.html",
      runtimeCaching: [
        { handler: "NetworkFirst", urlPattern: "./index.html" },
        { handler: "CacheFirst", urlPattern: /^(?!.*html).*/ },
      ],
    }),
    new CompressionPlugin({
      test: /\.(js|css)(\?.*)?$/i,
      algorithm: "gzip",
      threshold: 4096,
    }),
  ];
}

module.exports = {
  mode: "DEV" in process.env ? "development" : "production",
  devServer: {
    hot: true,
  },
  entry: {
    main: "./src/index.ts",
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].[contenthash].bundle.js",
    assetModuleFilename: "images/[hash][ext][query]",
  },

  module: {
    rules: [
      {
        test: /\.s?css$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: [
                  "postcss-import",
                  "tailwindcss/nesting",
                  "tailwindcss",
                  "autoprefixer",
                ],
              },
            },
          },
          "sass-loader",
        ],
      },
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: [
          { loader: "babel-loader" },
          {
            loader: "ts-loader",
            options: {
              appendTsSuffixTo: [/\.vue$/],
              transpileOnly: !("DEV" in process.env),
              compilerOptions: {
                module: "ESNext",
                moduleResolution: "bundler",
              },
            },
          },
        ],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.vue$/,
        loader: "vue-loader",
        options: {
          compilerOptions: {
            isCustomElement: (tag) => {
              return tag.startsWith("w3m-") || tag == "unknownTokenLogo";
            },
          },
        },
      },
      {
        test: /\.(png|jpe?g|gif|svg|ttf|woff|woff2)$/i,
        type: "asset/resource",
      },
    ],
  },

  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },

  plugins: [
    new VueLoaderPlugin(),
    new MiniCssExtractPlugin(),
    new CleanWebpackPlugin(),
    new htmlWebpackPlugin({
      template: path.resolve(__dirname, "public", "index.html"),
      favicon: "./public/favicon.ico",
    }),
    new PurgeCSSPlugin({
      paths: glob.sync(`${path.resolve(__dirname, "src")}/**/*`, {
        nodir: true,
      }),
      safelist: {
        greedy: [/\-|\:|\[|\//, /fade.*/],
      },
    }),
    new DefinePlugin({
      CONFIG: JSON.stringify(config),
      DEX_ABI: JSON.stringify(
        JSON.parse(
          fs.readFileSync(
            path.resolve(__dirname, "./artifacts/contracts/Dex.sol/Dex.json"),
            "utf8"
          )
        ).abi
      ),
      STACKING_ABI: JSON.stringify(
        JSON.parse(
          fs.readFileSync(
            path.resolve(
              __dirname,
              "./artifacts/contracts/Stacking.sol/Stacking.json"
            ),
            "utf8"
          )
        ).abi
      ),
      __VUE_OPTIONS_API__: "false",
      __VUE_PROD_DEVTOOLS__: "DEV" in process.env ? "true" : "false",
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__:
        "DEV" in process.env ? "true" : "false",
    }),
    new NodePolyfillPlugin(),
    new WebpackPwaManifest({
      name: "coss3.io",
      short_name: "coss3.io",
      description: "decentralised non custodian trading platform",
      background_color: "#ffffff",
      crossorigin: "use-credentials",
      ios: true,
      publicPath: ".",
      icons: [
        {
          src: path.resolve("public/favicon.ico"),
          type: "image/png",
          sizes: [96, 128, 192, 256, 384, 512], // multiple sizes,
          ios: true,
        },
      ],
    }),
    new PreloadWebpackPlugin({
      rel: "preload",
      include: "all",
    }),
    ...optimize,
    // new CircularDependencyPlugin({
    //   exclude: /a\.js|node_modules/,
    //   failOnError: false,
    //   allowAsyncCycles: false,
    //   cwd: process.cwd(),
    // })
  ],

  optimization: {
    usedExports: true,
    minimize: true,
    minimizer: ["...", new HtmlMinimizerPlugin()],
    moduleIds: "deterministic",
    runtimeChunk: "single",
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          priority: -10,
          chunks: "all",
        },
      },
    },
  },
};
