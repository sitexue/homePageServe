const path = require('path');
const fs = require('fs');
const config = require('../config/config');

// 检查文件夹是否存在，不存在就新建
function checkDirExist(path) {
    if (!fs.existsSync(path)) {
        fs.mkdirSync(path);
    }
}

// 获取文件后缀名
function getUploadFileExt(name) {
    let ext = name.split('.');
    return ext[ext.length - 1];
}

// 当前日期对应的文件夹
function getUploadDirName() {
    const date = new Date();
    let month = Number.parseInt(date.getMonth()) + 1;
    month = month.toString().length > 1 ? month : `0${month}`;
    const dir = `${date.getFullYear()}${month}${date.getDate()}`;
    return dir;
}

// 返回文件名称
function getUploadFileName(ext) {
    return `${Date.now()}${Number.parseInt(Math.random() * 10000)}.${ext}`;
}

const bodySet = {
    multipart: true, // 支持文件上传
    formidable: {
        uploadDir: path.join(__dirname, '../', 'exposed/upload/'), // 设置文件上传目录
        keepExtensions: true, // 保持文件的后缀
        maxFieldsSize: 2 * 1024 * 1024, // 文件上传大小
        onFileBegin: (name, file) => { // 文件上传前的设置
            const ext = getUploadFileExt(file.name);
            const dirName = getUploadDirName();
            const filePath = `${config.outerDir}/${config.upDir}/${dirName}`;
            const dir = path.join(__dirname, '../', filePath);
            checkDirExist(dir);
            const fileName = getUploadFileName(ext);
            file.path = `${dir}/${fileName}`;
            file.filePath = `${config.upDir}/${dirName}/${fileName}`;

            /*app.context.uploadpath = app.context.uploadpath ? app.context.uploadpath : {};
            app.context.uploadpath[fileName] = `${dirName}/${fileName}`;*/
        },
        onError: (err) => {
            console.log(err);
        }
    }
}

module.exports = bodySet