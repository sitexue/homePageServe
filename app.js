const Koa = require('koa');
const router = require('./router'); //路由
// const bodyParser = require('koa-bodyparser');  //解析post 不支持formdata
const koaBody = require('koa-body');
const cors = require('koa2-cors'); //option
const returnData = require('./middlewares/returnData');

const jwtKoa = require('koa-jwt'); // 验证登录
const tokenError = require('./middlewares/tokenError');
const config = require('./config/config');

const path = require('path');
const serve = require('koa-static'); //网站提供静态资源
const bodySet = require('./utils/upload');

// 创建一个Koa对象表示web app本身:
const app = new Koa();

app.use(cors());
// app.use(bodyParser());
app.use(koaBody(bodySet));

app.use(serve(path.join(__dirname, config.outerDir)));

// 对于任何请求，app将调用该异步函数处理请求：
app.use(async (ctx, next) => {
    console.log(`${Date.now()} ${ctx.request.method} ${ctx.request.url}`);
    await next();
});

// 搭载returnData的参数
app.use(returnData);

// 验证登录相关
app.use(tokenError());
app.use(jwtKoa({
    secret: config.tokenSecret
}).unless({
    //数组中的路径不需要通过jwt验证
    path: [
        /^\/api\/user\/login/,
        /^\/api\/user\/reg/,
        /^\/api\/upload/,
        /^\/api\/notes\/list/,
        /^\/api\/notes\/info/,
        /^\/api\/talk\/list/,
        /^\/api\/talk\/info/,
        /^\/api\/photo\/albumList/,
        /^\/api\/photo\/photoList/,
        /^\/upload/,
        /^\/exposed/
    ]
}))

// add router middleware:
app.use(router(app));

// error 事件的监听
app.on('error', (err, ctx) => {
    console.error('server error', err);
});
// 在端口监听:
app.listen(config.port);