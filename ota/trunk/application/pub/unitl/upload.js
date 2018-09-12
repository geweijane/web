const fs = require('fs');
const path = require('path');
const moment = require('moment');
const send = require('koa-send');

const upload = {
  /** *
   * 上传文件
   * @param ctx
   * @return {Promise<{code: number, msg: string, data: {file: string}}>}
   */
  async doUpload(ctx) {
    const file = ctx.request.files.file;
    const filename = moment().format('x') + file.name.slice(file.name.lastIndexOf('.'));
    const result = {
      code: 0,
      msg: '上传成功',
      file: '',
    };
    // 创建可读流
    const reader = fs.createReadStream(file.path);
    const filePath = `${path.join(__dirname, '../../', 'upload/')}/${filename}`;
    // 创建可写流
    const upStream = fs.createWriteStream(filePath);
    // 可读流通过管道写入可写流
    reader.pipe(upStream);
    result.file = `http://${ctx.headers.host}/api/download/${filename}`;
    return result;
  },
  /** *
   * 下载文件
   * @param ctx
   * @return {Promise<void>}
   */
  async download(ctx) {
    const file = ctx.params.filename;
    const res = ctx.res;
    const filePath = `${process.cwd()}\\upload\\${file}`;
    fs.exists(filePath, (exists) => {
      if (exists) {
        const stat = fs.statSync(filePath);
        let buffer = null;
        res.setHeader('Accept-Range', 'bytes');
        res.setHeader('Content-Type', 'application/octet-stream');
        if (!ctx.req.headers.range) {
          res.setHeader('Content-Length', stat.size);
          res.statusCode = 200;
          buffer = fs.createReadStream(filePath);
        } else {
          const array = ctx.headers.range.split(/bytes=([0-9]*])-([0-9]*)/);
          const start = parseInt(array[1], 10);
          const end = parseInt(array[2], 10);
          const result = {
            start: isNaN(start) ? 0 : start,
            end: isNaN(end) ? (stat.size - 1) : end,
          };
          if (!isNaN(start) && (isNaN(end) || end >= stat.size)) {
            result.start = start;
            result.end = stat.size - 1;
          }
          if ((isNaN(start) || start >= stat.size) && !isNaN(end)) {
            result.start = stat.size - end;
            result.end = stat.size - 1;
          }
          res.setHeader('Content-Range', `bytes${result.size}-${result.end}/${stat.size}`);
          res.setHeader('Content-Length', result.start === result.end ? 0 : (result.end - result.start + 1));
          res.setHeader('Cache-Control', 'no-cache');
          res.statusCode = 206;
          buffer = fs.createReadStream(filePath, result);
        }
        if (buffer === null) {
          res.end();
        } else {
          ctx.body = buffer.pipe(res);
        }
      } else {
        ctx.body = '文件不存在';
      }
    });
  },
};

module.exports = upload;
