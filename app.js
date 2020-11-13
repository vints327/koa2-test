const Koa = require('koa');
const path = require('path')
const bodyParser = require('koa-bodyparser');
// const ejs = require('ejs');
const session = require('koa-session-minimal');
const MysqlStore = require('koa-mysql-session');
const config = require('./config/default.js');
const router = require('koa-router')
const views = require('koa-views')
// const koaStatic = require('koa-static')
const staticCache = require('koa-static-cache')
const app = new Koa()


/* app.use(async function(ctx) {
  ctx.body = 'Hello World';
}); */

const sessionMysqlConfig= {
    user: config.database.USERNAME,
    password: config.database.PASSWORD,
    database: config.database.DATABASE,
    host: config.database.HOST,
}

// 配置session中间件
app.use(session({
  key: 'USER_SID',
  store: new MysqlStore(sessionMysqlConfig)
}))

// 配置静态资源加载中间件
// app.use(koaStatic(
//   path.join(__dirname , './public')
// ))
// 缓存
app.use(staticCache(path.join(__dirname, './public'), { dynamic: true }, {
  maxAge: 365 * 24 * 60 * 60
}))
app.use(staticCache(path.join(__dirname, './public/images'), { dynamic: true }, {
  maxAge: 365 * 24 * 60 * 60
}))



app.use(bodyParser({
  formLimit: '1mb'
}))

app.use(require('./routers/signin.js').routes())
app.use(require('./routers/signup.js').routes())


if (!module.parent) app.listen(config.port);
