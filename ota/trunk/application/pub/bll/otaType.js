const otaTypemode = require('../model/otaType');

const otaType = {
  /** **
   * 新增固件类型
   * @param ctx
   * @return {Promise<{code: number, data: null, msg: string}>}
   */
  async add(ctx) {
    const form = ctx.request.body;
    const args = {
      project: form.project,
      customer: form.customer,
      chip: form.chip,
      remark: form.remark,
    };
    const result = {
      code: 0,
      data: null,
      msg: 'success',
    };
    if (!args.project || !args.customer || !args.chip) {
      result.code = -1;
      result.msg = '缺少参数';
      return result;
    }
    const isExit = await otaTypemode.getCountBySame(args);
    if (isExit.length !== 0) {
      result.code = -1;
      result.msg = '固件已经存在';
      return result;
    }
    const insertRuslt = await otaTypemode.add(args);
    const data = await otaTypemode.getOtatypeById({ id: insertRuslt.insertId });
    result.data = data[0];
    return result;
  },
  /** *
   * 单个固件类型获取
   * @param ctx
   * @return {Promise<{code: number, data: null, msg: string}>}
   */
  async getById(ctx) {
    const form = ctx.params;
    const args = {
      id: form.id,
    };
    const result = {
      code: 0,
      data: [],
      msg: 'success',
    };
    if (!args.id) {
      result.code = -1;
      result.msg = '缺少参数';
      return result;
    }
    const otaTypeResult = await otaTypemode.getOtatypeById(args);
    if (otaTypeResult.length === 0) {
      result.code = -1;
      result.msg = '固件不存在';
      return result;
    }
    result.data = otaTypeResult[0];
    return result;
  },
  /** **
   * 编辑
   * @param ctx
   * @return {Promise<{code: number, data: null, msg: string}>}
   */
  async update(ctx) {
    const form = ctx.request.body;
    const args = {
      id: ctx.params.id,
      project: form.project,
      customer: form.customer,
      chip: form.chip,
      remark: form.remark,
    };
    const result = {
      code: 0,
      data: null,
      msg: 'success',
    };
    if (!args.id || !args.project || !args.customer || !args.chip) {
      result.code = -1;
      result.msg = '缺少参数';
      return result;
    }
    const updateResult = await otaTypemode.update(args);
    if (updateResult.affectedRows === 0) {
      result.code = -1;
      result.msg = '固件不存在';
      return result;
    }
    const selectResult = await otaTypemode.getOtatypeById(args);
    result.data = selectResult[0];
    return result;
  },
  /** *
   * 删除
   * @param ctx
   * @return {Promise<{code: number, data: {id: *}, msg: string}>}
   */
  async delete(ctx) {
    const form = ctx.params;
    const args = {
      id: form.id,
    };
    const result = {
      code: 0,
      data: { id: args.id },
      msg: 'success',
    };
    if (!args.id) {
      result.code = -1;
      result.msg = '缺少参数';
      return result;
    }
    await otaTypemode.delete(args);
    return result;
  },
  /** *
   * 固件类型列表
   * @param ctx
   * @return {Promise<{code: number, msg: string, data: Array, total: number}>}
   */
  async getList() {
    const result = {
      code: 0,
      msg: 'success',
      data: [],
      total: 0,
    };
    const listResult = await otaTypemode.list();
    result.data = listResult;
    return result;
  },
};
module.exports = otaType;
