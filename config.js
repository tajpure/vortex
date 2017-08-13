var path = require('path')

module.exports = {
  build: {
    releasesRoot: path.resolve(__dirname, 'releases'),
    outputRoot: path.resolve(__dirname, 'dist'),
    assetsSubDirectory: 'assets',
    productionSourceMap: true
  },
  release: {
    platform: 'all'
  },
  dev: {
    port: 2048,
    proxyTable: {
    },
    vueDevTools: false
  }
}
