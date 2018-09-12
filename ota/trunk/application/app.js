const Koa = require('koa');

const app = new Koa();
const views = require('koa-views');
const json = require('koa-json');
const onerror = require('koa-onerror');
const bodyparser = require('koa-bodyparser');
const logger = require('koa-logger');
const cors = require('koa2-cors');
const koaBody = require('koa-body');

const config = require('./pub/config/config');

const api = require('./routes/api');

// error handler
onerror(app);

app.use(koaBody({
  multipart: true,
  formidable: {
    maxFileSize: 20 * 1024 * 1024, // 设置上传文件大小最大限制，默认2M
  },
}));
// middlewares
app.use(bodyparser({
  enableTypes: ['json', 'form', 'text'],
  formLimit: 20 * 1024 * 1024,
}));
// 具体参数我们在后面进行解释 跨域
app.use(cors({
  origin() {
    return '*';
  },
  exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
  maxAge: 5,
  credentials: true,
  allowMethods: ['GET', 'POST', 'DELETE', 'PUT'],
  allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
}));
app.use(json());
app.use(logger());
app.use(require('koa-static')(`${__dirname}/public`));

app.use(views(`${__dirname}/views`, {
  extension: 'pug',
}));

// logger
app.use(async (ctx, next) => {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

// routes
app.use(api.routes(), api.allowedMethods());

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx);
});

app.listen(config.SERVER_PORT, () => {
  console.log(`Starting at port ${config.SERVER_PORT}!`);
});
module.exports = app;
