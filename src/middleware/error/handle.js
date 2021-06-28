'use strict';
const axios = require('axios');
const empty = require('is-empty');
const config = require('../../config/common');
const packageInfo = require('../../../package.json');
const ip = require('ip');

/**
* 공통 에러처리 (slack 발송)
* @param {Object} err 에러 object
* @param {Object} req req
* @param {Object} res res
*/
const errorHandle = (err, req, res) => {
  try {
    if (empty(err.status)) {
      err.status = '500';
    }

    const host = config.apiServer.host;
    const port = config.apiServer.port;
    const version = config.apiServer.version;
    const url = `http://${host}:${port}/${version}/slack`;

    const body = {
      channel: 'vcast-error-monit',
      messageType: 'error',
      application: packageInfo.name,
      version: packageInfo.version,
      env: config.env,
      server: ip.address(),
      url: req.originalUrl,
      errorCode: err.status,
      errorMessage: err.message,
    };

    if (config.slack.use === 'true' && err.status !== '404') {
      axios.post(url, body);
    }
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = errorHandle;
