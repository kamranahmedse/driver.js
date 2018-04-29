const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const opn = require('opn');

const config = require('./webpack.config.demo');

const PORT = 3000;
const HOST = 'localhost';
const URL = `http://${HOST}:${PORT}`;

new WebpackDevServer(webpack(config), {
  publicPath: config.output.publicPath,
}).listen(PORT, HOST, (error, result) => {
  if (error) {
    console.error(error);
  }

  opn(URL);
  console.log(`Listening at ${URL}`);
});
