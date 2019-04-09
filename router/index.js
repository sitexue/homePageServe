const fs = require('fs');

function addMapping(router, mapping, file) {
    mapping.forEach(map => {
        const method = map.method.toLowerCase()
        const path = '/' + file.replace('.js', '') + map.path
        const fn = map.fn
        /*switch (method) {
          case 'get':
            router.get(path, fn);
            break;
          case 'post':
            router.post(path, fn);
            break;
          case 'put':
            router.put(path, fn);
            break;
          case 'delete':
            router.delete(path, fn);
            break;
          default:
            console.log(`invalid URL: ${path}`);
            break;
        }*/
        router[method]('/api' + path, fn);
    })
}

function addRouter(router, Router_dir) {
    fs.readdirSync(__dirname + `/../${Router_dir}/`).filter((file) => {
        return file.endsWith('.js') && file != 'index.js';
    }).forEach((file) => {
        let mapping = require(__dirname + `/../${Router_dir}/` + file);
        addMapping(router, mapping, file);
    });
}

module.exports = function (app) {
    const router = require('koa-router')();
    let Router_dir = 'controllers';
    addRouter(router, Router_dir);
    app.use(router.allowedMethods());
    return router.routes();
}