const talk = require('../model/talk')
const moment = require('moment')

const list = async (ctx, next) => {
    let {
        page = 1, limit = 10
    } = ctx.query;

    const reg = /^[0-9]+$/;
    if (isNaN(page) || isNaN(limit) || !reg.test(page) || !reg.test(limit)) {
        ctx.error(214, '参数错误')
        return false;
    }
    limit = Number(limit);
    page = Number(page);
    const offset = limit * (page - 1);
    const result = await talk.findAndCountAll({
        attributes: ['id', 'title', 'intro', 'createTime', 'tag'],
        where: {
            status: 1
        },
        limit: limit,
        offset: offset,
        order: [
            ['id','DESC']
        ]
    })

    const list = result.rows.map(item => {
        item.dataValues.createTime = moment(item.dataValues.createTime).format('YYYY-MM-DD HH:mm:ss')
        return item
    })

    const data = {
        list,
        total: result.count
    }
    ctx.success(200, '获取成功', data);

}

const info = async (ctx, next) => {
    const {
        id
    } = ctx.query;

    if (!id) {
        ctx.error(214, '参数错误');
        return false;
    }

    const result = await talk.findById(id, {
        where: {
            status: 1
        }
    })

    if (!result || result.status == 0) {
        ctx.error(214, '文章不存在');
        return false;
    }

    result.dataValues.createTime = moment(result.dataValues.createTime).format('YYYY-MM-DD HH:mm:ss')

    ctx.success(200, '获取成功', result);
}

const add = async (ctx, next) => {
    const {
        title,
        intro,
        tag,
        content
    } = ctx.request.body;
    const createTime = moment().format('YYYY-MM-DD HH:mm:ss');

    try {
        await talk.create({
            title,
            intro,
            tag,
            content,
            createTime
        })
        ctx.success(200, '提交成功');
    }
    catch(err){
        console.error(err)
        ctx.error(214, err.message.split(',')[0]);
    }

}

const update = async (ctx, next) => {
    const {
        id,
        title,
        intro,
        tag,
        content
    } = ctx.request.body;
    const updateTime = moment().format('YYYY-MM-DD HH:mm:ss');

    if (!id) {
        ctx.error(214, '文章id不存在');
        return false;
    }
    try{
        await talk.update({
            title,
            intro,
            tag,
            content,
            updateTime
        }, {
            where: {
                id
            }
        })
    
        ctx.success(200, '提交成功');
    }
    catch(err){
        console.error(err)
        ctx.error(214, err.message.split(',')[0]);
    }
}

const del = async (ctx, next) => {
    let {
        id
    } = ctx.query;

    if (!id) {
        ctx.error(214, '文章id不存在')
        return
    }

    await talk.update({
        status: 0
    }, {
        where: {
            id
        }
    })
    ctx.success(200, '删除成功');

}

module.exports = [{
    method: 'get',
    path: '/list',
    fn: list
}, {
    method: 'get',
    path: '/info',
    fn: info
}, {
    method: 'post',
    path: '/add',
    fn: add
}, {
    method: 'post',
    path: '/update',
    fn: update
}, {
    method: 'delete',
    path: '/del',
    fn: del
}]