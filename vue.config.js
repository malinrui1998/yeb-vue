let proxyObj = {}
proxyObj['/'] = {
  ws: false,
  // 目标地址
  target: 'http://localhost:8081',
  // 请求头的host会被设置成target
  changeOrigin: true,
  // 不重写请求地址
  pathReWrite: {
    '^/': '/'
  }
}

proxyObj['/ws'] = {
  ws: false,
  target: 'ws://localhost:8081'
}


module.exports = {
  devServer: {
    host: 'localhost',
    port: 8080,
    proxy: proxyObj
  }
}