const config = require('../config/config');

const filesUpload = async (ctx, next) => {
    const file = ctx.request.files.file;
    const filePath = file.filePath;
    if (filePath) {
        ctx.success(200, '上传成功', {
            path: filePath
        });
    } else {
        ctx.error(214, '上传错误');
    }
}

module.exports = [{
    method: 'post',
    path: '/filesUpload',
    fn: filesUpload
}]