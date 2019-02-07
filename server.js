const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const opn = require('opn');

const config = require('./config/webpack.config.demo');

const PORT = 3000;
const HOST = 'localhost';
const URL = `http://${HOST}:${PORT}`;

config.entry.unshift(`webpack-dev-server/client?${URL}`);

new WebpackDevServer(webpack(config))
  .listen(PORT, HOST, (error) => {
    if (error) {
      console.error(error);
      return;
    }

    opn(URL);
    console.log(`Listening at ${URL}`);
  });
