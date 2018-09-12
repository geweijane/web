const chipModel = require('../model/chip');

const chip = {
  async add(ctx) {
    const form = ctx.request.body;
    const args = {
      chip: form.chip,
      type: form.type,
    };
    const result = {
      code: 0,
      msg: '操作成功',
    };
    if (!args.chip && !args.type) {
      result.code = -1;
      result.msg = '参数缺失';
      return result;
    }
    const countResult = await chipModel.getByChip(args);
    if (countResult.length !== 0) {
      result.code = -1;
      result.msg = '芯片已经存在';
      return result;
    }
    const chipResult = await chipModel.add(args);
    if (chipResult.affectedRows === 0) {
      result.code = -1;
      result.msg = '新增失败';
      return result;
    }
    result.data = {
      chip: args.chip,
      type: args.type,
    };
    return result;
  },
  async list() {
    const result = {
      code: 0,
      data: null,
      msg: '操作成功',
    };
    const chipResult = await chipModel.list();
    result.data = chipResult;
    return result;
  },
  async update(ctx) {
    const form = ctx.request.body;
    const args = {
      chip: ctx.params.chip,
      type: form.type,
    };
    const result = {
      code: 0,
      data: null,
      msg: '操作成功',
    };
    if (!args.chip && !args.type) {
      result.code = -1;
      result.msg = '参数缺失';
      return result;
    }
    const chipResult = await chipModel.update(args);
    if (chipResult.affectedRows === 0) {
      result.code = -1;
      result.msg = '编辑失败';
      return result;
    }
    result.data = {
      chip: args.chip,
      type: args.type,
    };
    return result;
  },
};

module.exports = chip;
