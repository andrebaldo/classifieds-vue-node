module.exports = {
  transpileDependencies: ["vuetify"],

  chainWebpack: (config) => {
    config.module
      .rule('storysource')
      .test(/\.stories\.js?$/)
      .post()
      .use('storysource')
      .loader(require.resolve('@storybook/addon-storysource/loader'))
  },
  pwa: {
    name: "Classi Manx",
    themeColor: "#3F51B5"
  }
};
