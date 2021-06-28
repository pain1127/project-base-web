'use strict';

const dotenv = require('dotenv');
dotenv.config();

const config = {
  env: process.env.NODE_ENV,
  port: process.env.USE_PORT,
  swagger: {
    host: process.env.SWAGGER_HOST,
  },
  slack: {
    use: process.env.SLACK_SEND,
  },
  mariaDB: {
    host: process.env.MARIADB_HOST,
    port: process.env.MARIADB_PORT,
    username: process.env.MARIADB_USERNAME,
    password: process.env.MARIADB_PASSWORD,
    database: process.env.MARIADB_DATABASE,
  },
};

module.exports = config;
