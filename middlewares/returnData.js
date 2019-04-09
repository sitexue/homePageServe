function getData(ctx) {
    return async (status, msg, data) => {
        const body = {
            status: status || 200,
            msg: msg || '',
            data: data || {}
        }
        return ctx.body = body;
    }
}

module.exports = async function (ctx, next) {
    if (!ctx.success) {
        // 成功
        ctx.success = getData(ctx);
    }
    if (!ctx.error) {
        // 失败
        ctx.error = getData(ctx);
    }
    await next();
};