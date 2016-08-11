var path = require('path')

module.exports = {
  build: {
    releasesRoot: path.resolve(__dirname, 'releases'),
    outputRoot: path.resolve(__dirname, 'dist'),
    assetsSubDirectory: 'assets',
    productionSourceMap: true
  },
  release: {
    platform: 'linux'
  },
  dev: {
    port: 8080,
    proxyTable: {
      // '/api': {
      //   target: 'http://jsonplaceholder.typicode.com',
      //   changeOrigin: true,
      //   pathRewrite: {
      //     '^/api': ''
      //   }
      // }
    },
    vueDevTools: false
  }
}
