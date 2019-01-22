const httpProxy = require('http-proxy');
let proxy = httpProxy.createProxyServer();

proxy.on('proxyReq', function (proxyReq, req, res) {
    let reqBody = JSON.stringify(req.body);
    console.log("--------- req from client agent --------------", reqBody);
    if (req.body) {
        console.log(req.body);
        proxyReq.setHeader('Content-Length', Buffer.byteLength(reqBody, 'utf8'));
        //proxyReq.setHeader('Content-Length', new Buffer(reqBody, 'utf8').length);
        proxyReq.setHeader('Content-Type', 'application/json;charset=UTF-8');
        proxyReq.write(reqBody);
        proxyReq.end();
    }
});
proxy.on('proxyRes', function (proxyRes, req, res) {
    // 设置允许跨域访问该服务.
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods", "POST, GET, PUT, OPTIONS, DELETE");
    res.header("Access-Control-Max-Age", "5000");
    res.header("Access-Control-Allow-Headers", "content-type, Accept, X-Requested-With, remember-me");

    var resBody = new Buffer('');
    proxyRes.on('data', function (data) {
        resBody = Buffer.concat([resBody, data]);
    });
    proxyRes.on('end', function () {
        resBody = resBody.toString();
        console.log("--------- res from proxied server -------------", resBody);
    });
});
proxy.on('error', function (err, req, res) {
    res.writeHead(500, {
        'Content-Type': 'text/plain'
    });
    res.end('Something went wrong. And we are reporting a custom error message.');
});

module.exports = function (req, res, info) {
    proxy.web(req, res, {
        target: 'http://'+info.host+':' +  info.port + req.baseUrl,
    },(e)=>{
        console.log("proxy error call back ");
        console.log(e);
    });
};

