// vue.config.js
module.exports = {
  lintOnSave: false,
  devServer: {
    port: 9090,
    open: true
  },
  chainWebpack: (config) => {
    config
      .plugin('html')
      .tap((args) => {
        args[0].title = 'vue商城后台'
        return args
      })
  }
}
