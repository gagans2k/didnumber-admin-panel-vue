const { defineConfig } = require("@vue/cli-service");

module.exports = defineConfig({
  configureWebpack: {
    resolve: {
      alias: {
        "@": require("path").resolve(__dirname, "src"),
      },
    },
  },
  lintOnSave: false,
  devServer: {
    client: {
      overlay: {
        warnings: false,
        errors: false,
      },
    },
  },
});
