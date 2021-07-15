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
   },
  //  externals: {
  //   // only define the dependencies you are NOT using as externals!
  //   // canvg: "canvg",
    
  //   // dompurify: "dompurify"
  // }
  },

  chainWebpack: config => {
    
    config.module
      .rule('swf')
      .test(/\.swf$/)
      .use('swf-loader')
        .loader('swf-loader')
        .end()

        // config.externals({html2canvas: "html2canvas"})
     
  }
};