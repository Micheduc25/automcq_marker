module.exports = {
    css: {
      loaderOptions: {
        sass: {
          additionalData: `@import "@/assets/scss/_shared.scss";`,
        },
      },
    },
    configureWebpack: {
      module: {
        rules: [
          {
            test: /\.s[ac]ss$/i,
            use: [
              // Creates `style` nodes from JS strings
              // "style-loader",
              // Translates CSS into CommonJS
              "css-loader",
              // Compiles Sass to CSS
              "sass-loader",
            ],
      },

        ]
   }
  },

  chainWebpack: config => {
    // SWF Loader
    config.module
      .rule('swf')
      .test(/\.swf$/)
      .use('swf-loader')
        .loader('swf-loader')
        .end()
     
  }
};