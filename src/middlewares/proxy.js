const { createProxyMiddleware, responseInterceptor } = require('http-proxy-middleware');
const config = require('../config/config');

const proxy = () =>
  createProxyMiddleware({
    target: config.pywbURL,
    changeOrigin: true,
    // pathRewrite: { '^/v1/papers/dev': `dev/` },
    // pathRewrite: (path, req) => path.replace(`/v1/papers/${req.params[0]}`, `${req.params[0]}`),
    selfHandleResponse: true,
    onProxyRes: responseInterceptor(async (responseBuffer, proxyRes, req, res) => {
      let location = res.getHeader('location');
      if (location) {
        location = location.replace(/10.97.33.190:8085/g, '10.97.33.190:3000');
        // location = `/v1/papers${location}`;
        res.setHeader('location', location);
      }
      const imageTypes = ['image/png', 'image/jpg', 'image/jpeg', 'image/gif', 'binary/octet-stream'];
      if (proxyRes.headers['content-type'] && imageTypes.find((value) => proxyRes.headers['content-type'].includes(value))) {
        return responseBuffer;
      }
      const response = responseBuffer.toString('utf8'); // convert buffer to string
      return response.replace(/10.97.33.190:8085/g, '10.97.33.190:3000'); // manipulate response and return the result
    }),
  });

module.exports = proxy;
