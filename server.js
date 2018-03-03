const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const config = require('./webpack.dev.config');
const opn = require('opn');

const PORT = 3000;
const HOST = 'localhost';
const URL = `http://${HOST}:${PORT}`;

new WebpackDevServer(webpack(config), {
    publicPath: config.output.publicPath
}).listen(PORT, HOST, function (error, result) {
    if (error) {
        console.error(error);
    }

    opn(URL);
    console.log(`Listening at ${URL}`);
});
