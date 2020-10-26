const webpack = require('webpack')
module.exports = {
    lintOnSave: true,
    productionSourceMap: false,
    chainWebpack: (config) => {
        //忽略的打包文件
        config.externals({
            'vue': 'Vue',
            'vue-router': 'VueRouter',
            'vuex': 'Vuex',
            'axios': 'axios',
            'element-ui': 'ELEMENT',
        })
        config.plugin('provide').use(webpack.ProvidePlugin, [{
            'window.Quill': 'quill'
        }])
        const entry = config.entry('app')
        entry
            .add('babel-polyfill')
            .end()
        entry
            .add('classlist-polyfill')
            .end()
        entry
            .add('@/mock')
            .end()
    },
    devServer: {
        // 端口配置
        port: 8080,
        // 反向代理配置
        proxy: {
            '/api': {
                //target: 'http://127.0.0.1:8081',
             //  target: 'http://192.168.200.30:8081',
                 target:'https://ynyiot.com',
                changeOrigin: true,
                ws: true,
              /*   pathRewrite: {
                    '^/api': '/'
                } */
            },
            '/ys7': {
                target: 'https://open.ys7.com/api',
                ws: false,
                changeOrigin: true,
                pathRewrite: {
                    '^/ys7': '/'
                }
            },
            '/s6': {
                // target:'http://apis.juhe.cn',
                target: 'https://free-api.heweather.net',
                changeOrigin: true
            },
            '/ipquery': {
                target: 'http://ip.ws.126.net'
            },
        }
    },
    publicPath: '/management/',
    outputDir: 'management'
}
