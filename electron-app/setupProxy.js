const {createProxyMiddleware} = require('http-proxy-middleware')

module.exports = function(app){
    app.use(
        '/api',
        createProxyMiddleware({
            target:'http://127.0.0.1:3000',
            changeOrigin:true,
            secure:false,
            pathRewrite:{'^/api':''},
            onProxyReq:(proxyReq)=>{
                proxyReq.setHeader('Origin','http://localhost:5173')
            }
        })
    )
}