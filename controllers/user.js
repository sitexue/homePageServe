const user = require('../model/user')
const md5 = require('md5')
const moment = require('moment');
const jwt = require('jsonwebtoken');
const config = require('../config/config');

// 处理数据库拿到的用户信息
const userInfoDeal = (item) => {
    delete item.dataValues.id
    delete item.dataValues.password
    delete item.dataValues.status
    delete account
    item.dataValues.createTime = item.dataValues.createTime ? moment(item.dataValues.createTime).format('YYYY-MM-DD HH:mm:ss') : ''
    item.dataValues.lastTime = item.dataValues.lastTime ? moment(item.dataValues.lastTime).format('YYYY-MM-DD HH:mm:ss') : ''
    return item
}

// 登录
const login = async (ctx, next) => {
    const account = ctx.request.body.account;
    const password = ctx.request.body.password;

    const data = await user.findOne({
        where: {
            account,
            password,
            status: 1
        }
    })

    if (!data) {
        ctx.error(214, '账号或密码错误');
        return;
    }

    await user.update({
        password,
        time: moment().format('YYYY-MM-DD HH:mm:ss'),
        lastTime: data.time
    }, {
        where: {
            account
        }
    })

    const userToken = {
        userId: data.userId
    }
    const token = jwt.sign(userToken, config.tokenSecret, {
        expiresIn: '2h'
    });
    data.dataValues.token = token;
    userInfoDeal(data);
    ctx.success(200, '登录成功', data);
}

// 注册
const reg = async (ctx, next) => {
    const account = ctx.request.body.account;
    const password = ctx.request.body.password;

    const time = new Date();
    const rand = Math.random();

    await user.findOrCreate({
        where: {
            account
        },
        defaults: {
            userId: md5(time + rand),
            account,
            password,
            name: account,
            time: moment().format('YYYY-MM-DD HH:mm:ss'),
            createTime: moment().format('YYYY-MM-DD HH:mm:ss'),
            level: 1
        }
    }).spread(function (user, created) {
        if (created) {
            ctx.success(200, '账号创建成功');
        } else {
            ctx.error(214, '用户已存在');
        }
    }).catch(err => {
        console.error(err)
        ctx.error(214, err.message.split(',')[0]);
    })
}

// 用户信息
const info = async (ctx, next) => {
    const userId = ctx.user.userId;

    const data = await user.findOne({
        where: {
            userId
        }
    })

    if (!data) {
        ctx.error(401, '账号不存在');
        return;
    }

    userInfoDeal(data);
    ctx.success(200, '成功', data);
}

// 用户列表
const list = async (ctx, next) => {
    let {
        limit = 10, page = 1
    } = ctx.query;
    limit = Number(limit);
    page = Number(page);
    const offset = limit * (page - 1);

    await user.findAndCount({
        limit,
        offset,
        where: {
            status: 1,
        },
        order: [
            ['id','DESC']
        ]
    }).then(result => {
        const total = result.count;
        const list = result.rows;
        list.map((item, index) => {
            return userInfoDeal(item)
        })
        ctx.success(200, '获取成功', {
            total,
            list
        })
    })
}

// 删除用户
const del = async (ctx, next) => {
    let {
        id
    } = ctx.query;
    if (!id) {
        ctx.error(214, '错误userId')
        return
    }

    await user.update({
        status: 0
    }, {
        where: {
            userId: id
        }
    })
    ctx.success(200, '删除成功');

}

const update = async (ctx, next) => {
    const {
        userId,
        name,
        avatar
    } = ctx.request.body;
    if (userId) {
        await user.update({
            name,
            avatar
        }, {
            where: {
                userId: userId
            }
        })
        ctx.success(200, '修改成功');
    } else {
        ctx.error(214, '错误userId')
    }
}

module.exports = [{
    method: 'post',
    path: '/login',
    fn: login
}, {
    method: 'post',
    path: '/reg',
    fn: reg
}, {
    method: 'get',
    path: '/info',
    fn: info
},
{
    method: 'get',
    path: '/list',
    fn: list
}, {
    method: 'delete',
    path: '/del',
    fn: del
}, {
    method: 'post',
    path: '/update',
    fn: update
}]