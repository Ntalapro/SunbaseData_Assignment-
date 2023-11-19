const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

// Define your API endpoint
const apiEndpoint = 'https://qa2.sunbasedata.com/sunbase/portal/api';

// Create a proxy for the API endpoint
const apiProxy = createProxyMiddleware({
    target: apiEndpoint,
    changeOrigin: true,
    secure: false,
});

// Use the proxy middleware
app.use('/api', apiProxy);

// Start the server on port 3000
const port = 3000;
app.listen(port, () => {
    console.log(`Proxy server is running on http://localhost:${port}`);
});
