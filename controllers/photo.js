const photoAlbum = require('../model/photoAlbum')
const photo = require('../model/photo')
const moment = require('moment')

// 相册列表
const albumList = async (ctx, next) => {
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
    const result = await photoAlbum.findAndCountAll({
        attributes: ['id', 'title', 'coverImg', 'createTime', 'updateTime'],
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
        item.dataValues.updateTime = moment(item.dataValues.updateTime).format('YYYY-MM-DD HH:mm:ss')
        return item
    })

    const data = {
        list,
        total: result.count
    }
    ctx.success(200, '获取成功', data);
}

const albumAdd = async (ctx, next) => {
    const {
        title,
        coverImg
    } = ctx.request.body;
    const createTime = moment().format('YYYY-MM-DD HH:mm:ss');
    try{
        await photoAlbum.create({
            title,
            coverImg,
            createTime
        })

        ctx.success(200, '提交成功');
    }
    catch(err){
        console.error(err)
        ctx.error(214, err.message.split(',')[0]);
    }
}

const albumUpdate = async (ctx, next) => {
    const {
        id,
        title,
        coverImg
    } = ctx.request.body;
    const updateTime = moment().format('YYYY-MM-DD HH:mm:ss');

    if (!id) {
        ctx.error(214, '相册id不存在');
        return false;
    }
    try{
        await photoAlbum.update({
            title,
            coverImg,
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

const albumDel = async (ctx, next) => {
    let {
        id
    } = ctx.query;

    if (!id) {
        ctx.error(214, '相册id不存在')
        return
    }

    await photoAlbum.update({
        status: 0
    }, {
        where: {
            id
        }
    })
    ctx.success(200, '删除成功');
}

// 根据相册id查找图片
const photoList = async (ctx, next) => {
    let {
        page = 1, limit = 1000, albumId
    } = ctx.query;

    const reg = /^[0-9]+$/;
    if (isNaN(page) || isNaN(limit) || !reg.test(page) || !reg.test(limit) || !albumId) {
        ctx.error(214, '参数错误')
        return false;
    }
    limit = Number(limit);
    page = Number(page);
    const offset = limit * (page - 1);
    const result = await photo.findAndCountAll({
        attributes: ['id', 'albumId', 'name', 'url', 'createTime'],
        where: {
            albumId,
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

const photoAdd = async (ctx, next) => {
    const {
        albumId,
        name,
        url
    } = ctx.request.body;
    const createTime = moment().format('YYYY-MM-DD HH:mm:ss');
    try{
        await photo.create({
            albumId,
            name,
            url,
            createTime
        })

        ctx.success(200, '提交成功');
    }
    catch(err){
        console.error(err)
        ctx.error(214, err.message.split(',')[0]);
    }
}

const photoDel = async (ctx, next) => {
    let {
        id
    } = ctx.query;

    if (!id) {
        ctx.error(214, '图片id不存在')
        return
    }
    const deleteTime = moment().format('YYYY-MM-DD HH:mm:ss');

    await photo.update({
        status: 0,
        deleteTime
    }, {
        where: {
            id
        }
    })
    ctx.success(200, '删除成功');
}


module.exports = [{
    method: 'get',
    path: '/albumList',
    fn: albumList
}, {
    method: 'post',
    path: '/albumAdd',
    fn: albumAdd
}, {
    method: 'post',
    path: '/albumUpdate',
    fn: albumUpdate
}, {
    method: 'delete',
    path: '/albumDel',
    fn: albumDel
}, {
    method: 'get',
    path: '/photoList',
    fn: photoList
}, {
    method: 'post',
    path: '/photoAdd',
    fn: photoAdd
}, {
    method: 'delete',
    path: '/photoDel',
    fn: photoDel
}]