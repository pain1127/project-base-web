const createError = require('http-errors');
const express = require('express');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const mysql = require('mysql2');
const config = require(`./config/common`);
const package = require('../package.json');
const moment = require('moment');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const errorHandle = require('./middleware/error/handle');
// routerf
const indexRouter = require('./routes/index');

const app = express();

// sync() 하면 DB스키마대로 서버실행시 테이블 존재 여부 파악하여 생성함.
// sequelize.sync(); // 서버 실행 시 MariaDB와 연동

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());

// logger 정의
const matchRoutes = ['sample', 'test'];
app.use(morgan((tokens, req, res) => {
  const methods = ['method', 'url', 'status', 'remote-addr', 'http-version', 'user-agent', 'response-time'];
  const log = methods.map((func) => tokens[func](req, res));
  /* DB작업에 대한 로직 정의 */
  return log;
},
{
  skip: (req, res) => {
    // 정의한 Route명 조건에 매칭되지 않으면 skip 처리 한다.
    const isMatch = matchRoutes.some((route) => req.url.indexOf(route) !== -1);
    return !isMatch;
  },
  immediate: true,
}));

app.use('/', indexRouter);

// swagger 정의
app.use('/api', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
}));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  errorHandle(err, req, res);
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// 로딩 메세지
console.log(`[${package.name}] 로딩시각 : ${moment().format('YYYY-MM-DD HH:mm:ss')}`);
console.log(`[${package.name}] 로딩환경 : ${config.env}`);
console.log(`[${package.name}] 사용포트 : ${config.port}`);
console.log(`[${package.name}] Version : ${package.version}`);

// mariaDB 연결
const pool = mysql.createPool({
  host: config.mariaDB.host,
  port: config.mariaDB.port,
  user: config.mariaDB.username,
  password: config.mariaDB.password,
  database: config.mariaDB.database,
});

pool.getConnection((err) => {
  if (err) {
    console.log(`[${package.name}] MariaDB 연결 실패 : ${err.stack}`);
    return;
  } else {
    const promisePool = pool.promise();
    app.locals.mariaClient = promisePool;
    console.log(`[${package.name}] MariaDB 연결 성공 : ${config.mariaDB.host}:${config.mariaDB.port}`);
  }
});

module.exports = app;
