const path = require("path");
const FileManagerPlugin = require("filemanager-webpack-plugin");
const MultipleEntryPlugin = require("react-app-rewire-multiple-entry");

const isProduction = () => {
  return process.env.NODE_ENV === "production";
};

const isDevelopment = () => {
  return process.env.NODE_ENV === "development";
};

const multipleEntry = MultipleEntryPlugin([
  {
    // points to the popup entry point
    entry: "src/popup/popup.js",
    template: "src/popup/popup.html",
    outPath: "/popup.html",
  },
  {
    // points to the options page entry point
    entry: "src/options/options.js",
    template: "src/options/option.html",
    outPath: "/option.html",
  },
]);

const devServerConfig = () => (config) => {
  return {
    ...config,
    static: [
      path.resolve(__dirname, "src/content"),
      path.resolve(__dirname, "src/background"),
    ],
    devMiddleware: {
      writeToDisk: true,
    },
  };
};

const getFileManagerPlugin = () => {
  return new FileManagerPlugin({
    events: {
      onEnd: {
        copy: [
          {
            source: "public",
            destination: isProduction() ? "build" : "watch",
          },
        ],
      },
    },
  });
};

const getOutputConfig = () => {
  const output = {
    path: path.resolve(__dirname + "/watch"),
    publicPath: "/",
    filename: "[name].js", // name configuration for the output files
  };
  if (isProduction()) {
    output.path = path.resolve(__dirname + "/build");
  }
  return output;
};

module.exports = {
  webpack: function (config) {
    // Configure entry point for popup and options
    multipleEntry.addMultiEntry(config);

    const background = ["./src/background/background.js"];

    if (isDevelopment()) {
      background.push("./cext-live-reload.js");
    }

    // Setup entry points
    config.entry = {
      ...config.entry,
      content: ["./src/content/content.js"],
      background,
    };

    // Stop splitting of chunks for Chrome extension
    config.optimization.splitChunks = {
      cacheGroups: {
        default: false,
      },
    };

    config.optimization.runtimeChunk = false;

    config.output = getOutputConfig(config);

    // Add File Manager Plugin
    config.plugins = [...config.plugins, getFileManagerPlugin()];

    return config;
  },
  devServer: function (config) {
    return devServerConfig(config);
  },
};
