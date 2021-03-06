const notes = require('../model/notes')
const moment = require('moment')
const fs = require('fs')
const path = require("path")
const { createDir, deleteFile } = require('../utils/utils')
const compressing = require('compressing')
const config = require('../config/config');

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
    const result = await notes.findAndCountAll({
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

    const result = await notes.findById(id, {
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
        md,
        html
    } = ctx.request.body;
    const createTime = moment().format('YYYY-MM-DD HH:mm:ss');
    try{
        await notes.create({
            title,
            intro,
            tag,
            md,
            html,
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
        md,
        html
    } = ctx.request.body;
    const updateTime = moment().format('YYYY-MM-DD HH:mm:ss');

    if (!id) {
        ctx.error(214, '文章id不存在');
        return false;
    }
    try{
        await notes.update({
            title,
            intro,
            tag,
            md,
            html,
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

    await notes.update({
        status: 0
    }, {
        where: {
            id
        }
    })
    ctx.success(200, '删除成功');
}

const exportFile = async (ctx, next) => {
    let {
        ids = ''
    } = ctx.request.body;

    let idList = []
    let flag = true
    if (ids) {
        idList = ids.split(',')
        for (let index = 0; index < idList.length; index++) {
            const item = idList[index]
            if (!/^\d$/.test(item)) {
                flag = false;
                break;
            }
        }
    }
    if (!flag) {
        ctx.error(214, '参数错误');
        return false
    }
    const where = { status: 1 }
    if (idList && idList.length > 0) {
        where.id = idList
    }
    const result = await notes.findAndCountAll({
        attributes: ['id', 'title', 'md'],
        where,
        order: [
            ['id','DESC']
        ]
    })

    const list = result.rows
    const fileDor = `../${config.outerDir}/export`

    if (!list || list.length < 1) {
        ctx.error(214, '无数据可导出');
    }

    await deleteFile(path.join(__dirname, fileDor))
    await createDir(path.join(__dirname, fileDor, '/学习笔记导出'))

    list.forEach(item => {
        const { md, title } = item
        fs.writeFileSync(path.join(__dirname, fileDor, '/学习笔记导出/', title + ".md"), md)
    })

    compressing.zip.compressDir(path.join(__dirname, fileDor, '/学习笔记导出'), path.join(__dirname, fileDor, "学习笔记导出.zip"))
    .then(
        ctx.success(200, '导出', 'export/学习笔记导出.zip')
    )
    .catch(err => {
        console.error(err)
        ctx.error(214, err)
    })
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
}, {
    method: 'post',
    path: '/exportFile',
    fn: exportFile
}]