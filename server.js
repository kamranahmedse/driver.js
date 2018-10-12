const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const opn = require('opn');

const config = require('./config/webpack.config.demo');

const PORT = 3000;
const HOST = 'localhost';
const URL = `http://${HOST}:${PORT}/dist/demo`;

new WebpackDevServer(webpack(config), {
  publicPath: config.output.publicPath,
}).listen(PORT, HOST, (error, result) => {
  if (error) {
    console.error(error);
    return;
  }

  opn(URL);
  console.log(`Listening at ${URL}`);
});
