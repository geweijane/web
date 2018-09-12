const router = require('koa-router')();
const otaType = require('../pub/bll/otaType');
const ota = require('../pub/bll/ota');
const chip = require('../pub/bll/chip');
const upload = require('../pub/unitl/upload');

router.prefix('/api');

// 新增固件类型
router.post('/otatype', async (ctx, next) => {
  const res = await otaType.add(ctx);
  ctx.body = res;
});
// 获取固件类型列表
router.get('/otatype', async (ctx, next) => {
  const res = await otaType.getList();
  ctx.body = res;
});
// 获取单个固件类型
router.get('/otatype/:id', async (ctx, next) => {
  const res = await otaType.getById(ctx);
  ctx.body = res;
});
// 删除单个固件类型
router.delete('/otatype/:id', async (ctx, next) => {
  const res = await otaType.delete(ctx);
  ctx.body = res;
});
// 修改某个固件类型
router.put('/otatype/:id', async (ctx, next) => {
  const res = await otaType.update(ctx);
  ctx.body = res;
});
// 新增固件
router.post('/ota', async (ctx, next) => {
  const res = await ota.add(ctx);
  ctx.body = res;
});
// 获取单个固件
router.get('/ota/:id', async (ctx, next) => {
  const res = await ota.getById(ctx);
  ctx.body = res;
});
// 获取固件列表
router.get('/ota', async (ctx, next) => {
  const res = await ota.getList(ctx);
  ctx.body = res;
});
// 修改固件
router.put('/ota/:id', async (ctx, next) => {
  const res = await ota.update(ctx);
  ctx.body = res;
});
// 删除固件
router.delete('/ota/:id', async (ctx, next) => {
  const res = await ota.delete(ctx);
  ctx.body = res;
});
// 上传文件
router.post('/upload', async (ctx, next) => {
  const res = await upload.doUpload(ctx);
  ctx.body = res;
});
// 下载文件
router.get('/download/:filename', async (ctx, next) => {
  await upload.download(ctx);
});
// ota 升级
router.get('/upgrade', async (ctx, next) => {
  const res = await ota.upgrade(ctx);
  ctx.body = res;
});
// chip 芯片新增
router.post('/chip', async (ctx, next) => {
  const res = await chip.add(ctx);
  ctx.body = res;
});
// chip 芯片编辑
router.put('/chip/:chip', async (ctx, next) => {
  const res = await chip.update(ctx);
  ctx.body = res;
});
// chip 列表获取
router.get('/chip', async (ctx, next) => {
  const res = await chip.list(ctx);
  ctx.body = res;
});
module.exports = router;
