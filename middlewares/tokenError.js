const jwt = require('jsonwebtoken');
const config = require('../config/config');
const util = require('util');
const verify = util.promisify(jwt.verify);

/**
 * 判断token是否可用
 */
module.exports = function () {
    return async function (ctx, next) {
        // 获取jwt
        const token = ctx.header.authorization;
        if (token) {
            try {
                // 解密payload，获取用户名和ID
                let payload = await verify(token.split(' ')[1], config.tokenSecret);
                ctx.user = {
                    userId: payload.userId
                };
            } catch (err) {
                if (err.status === 401) {
                    ctx.error(401, '登录已过期')
                } else {
                    ctx.error(401, '无效账号')
                }
            }
        }
        await next();
    }
}