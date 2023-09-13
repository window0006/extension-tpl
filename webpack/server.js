import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import detect from 'detect-port-alt';
import isRoot from 'is-root';
import chalk from 'chalk';

import webpackDevConfig from '../webpack.config.js';
import logger from './logger.js';


const isInteractive = process.stdout.isTTY;

async function choosePort(port, host) {
  const resPort = await detect(port, host);
  if (resPort === port) {
    return resPort;
  }
  const message =
    process.platform !== 'win32' && port < 1024 && !isRoot()
      ? 'Admin permissions are required to run a server on a port below 1024.'
      : `Something is already running on port ${port}.`;

  if (isInteractive) {
    console.log(chalk.yellow(message));
    return resPort;
  }
  console.log(chalk.red(message));
  return null;
}

async function startServer() {
  const host = webpackDevConfig.devServer?.host || 'localhost';
  const port = await choosePort(8080, host);
  if (port === null) {
    return;
  }
  const devServerOptions = {
    ...webpackDevConfig.devServer,
    port,
    host,
  };

  const compiler = webpack({
    ...webpackDevConfig,
    mode: 'development',
  });
  const server = new WebpackDevServer(devServerOptions, compiler);
  try {
    server.startCallback((err) => {
      if (err) {
        return logger.error(err.message);
      }
      return logger.start(port, host);
    });
  } catch (error) {
    console.log(chalk.red(error.message));
  }
}

startServer();
