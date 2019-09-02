const fs = require('fs');
const path = require("path");

// 创建文件夹
const createDir = function (path) {
  return new Promise((resolve, reject) => {
    fs.mkdir(path, {
      recursive: true
    }, (err) => {
      if (err) {
        console.error(err)
        reject()
      } else {
        resolve()
      }
    })
  })
}

// 删除文件(默认不删除根文件夹)
function deleteFile(path, delDir) {
  var files = [];
  if (fs.existsSync(path)) {
    files = fs.readdirSync(path);
    if (!files || files.length < 1) return false;
    files.forEach(function (file, index) {
      var curPath = path + "/" + file;
      if (fs.statSync(curPath).isDirectory()) { // recurse
        deleteFile(curPath, true);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    if (delDir) {
      fs.rmdirSync(path);
    }
  }
}

module.exports = {
  createDir,
  deleteFile
}