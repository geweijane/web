const otaModel = require('../model/ota');
const otaTypeModel = require('../model/otaType');
/**
 * mac地址转16进制
 * @param str
 * @return {number}
 */
const parseHex = str => parseInt(str, 16);
/** *
 * 验证 mac地址是否在mac地址段中
 * @param data
 * @param mac
 * @return {string}
 */
const verifyMac = (data, str) => {
  const arr = data.content.split('\n');
  let flag = false;
  for (let i = 0; i < arr.length; i++) {
    const temp = arr[i].split('-');
    if (temp.length === 1 && temp[0] === str) {
      flag = true;
      break;
    } else if (parseHex(str) >= parseHex(temp[0]) && parseHex(str) <= parseHex(temp[1])) {
      flag = true;
      break;
    }
  }
  return flag ? data.file : '';
};
const ota = {
  /** *
   * 获取固件列表
   * @param ctx
   * @return {Promise<{code: number, msg: string, data: Array, total: number}>}
   */
  async getList(ctx) {
    const form = ctx.query;
    const args = {
      page_size: form.pageSize ? parseInt(form.pageSize) : 10,
      page: form.p ? parseInt(form.p) : 1,
    };
    form.status && (args.status = form.status);
    form.type && (args.type = form.type);
    args.page_start = (args.page - 1) * args.page_size;
    const result = {
      code: 0,
      msg: '成功',
      data: [],
      total: 0,
    };
    const otaResult = await otaModel.list(args);
    result.data = otaResult;
    return result;
  },
  /** *
   * 获取单个固件 byID
   * @param ctx
   * @return {Promise<{code: number, msg: string, data: null}>}
   */
  async getById(ctx) {
    const form = ctx.params;
    const args = {
      id: form.id,
    };
    const result = {
      code: 0,
      msg: '成功',
      data: null,
    };
    const otaResult = await otaModel.getById(args);
    if (otaResult.length === 0) {
      result.code = -1;
      result.msg = '无此id固件';
      return result;
    }
    result.data = otaResult[0];
    return result;
  },
  /** *
   * 新增固件
   * @param ctx
   * @return {Promise<{code: number, msg: string, data: null}>}
   */
  async add(ctx) {
    const form = ctx.request.body;
    const args = {
      version: form.version,
      type: form.type,
      file: form.file,
      remark: form.remark,
      status: 0,
    };
    const result = {
      code: 0,
      msg: '新增成功',
      data: null,
    };
    if (!args.version || !args.type || !args.file) {
      result.code = -1;
      result.msg = '参数缺失';
      return result;
    }
    let otaResult = await otaModel.getCountBySame(args);
    if (otaResult[0].num !== 0) {
      result.code = -1;
      result.msg = '固件版本存在';
      return result;
    }
    otaResult = await otaModel.add(args);
    if (otaResult.insertId <= 0) {
      result.code = -1;
      result.msg = '添加失败';
      return result;
    }
    otaResult = await otaModel.getById({ id: otaResult.insertId });
    result.data = otaResult[0];
    return result;
  },
  /** *
   * 修改 ota
   * @param ctx
   * @return {Promise<{code: number, msg: string, data: null}>}
   */
  async update(ctx) {
    const form = ctx.request.body;
    const args = {
      id: ctx.params.id,
    };
    for (const index in form) {
      if (index !== 'id') {
        args[index] = form[index];
      }
    }
    const result = {
      code: 0,
      msg: '操作成功',
      data: null,
    };
    let otaResult = await otaModel.update(args);
    if (otaResult.affectedRows === 0) {
      result.code = -1;
      result.msg = 'ota不存在';
      return result;
    }
    otaResult = await otaModel.getById(args);
    result.data = otaResult[0];
    return result;
  },
  /** *
   * 删除 ota by id 将id的
   * @param ctx
   * @return {Promise<{code: number, msg: string, data: {id: *}}>}
   */
  async delete(ctx) {
    const form = ctx.params;
    const args = {
      id: form.id,
      status: -1,
    };
    const result = {
      code: 0,
      msg: '删除成功',
      data: {
        id: args.id,
      },
    };
    await otaModel.update(args);
    return result;
  },
  /** *
   * 升级
   * @param ctx
   * @return {Promise<{code: number}>}
   */
  async upgrade(ctx) {
    const form = ctx.query;
    const args = {
      version: form.version,
      project: form.project,
      customer: form.customer,
      content: form.content,
      chip: form.chip,
    };
    const result = {
      code: 0,
      msg: '',
    };
    if (args.version === undefined || !args.project || !args.customer || !args.content || !args.chip) {
      result.code = -1;
      result.msg = '参数缺失';
      return result;
    }
    // 获取固件类型
    const ExitTypeResult = await otaTypeModel.getCountBySame(args);
    if (ExitTypeResult.length === 0) {
      result.code = -1;
      result.msg = '固件系列不存在';
      return result;
    }
    args.type = ExitTypeResult[0].id;
    // 调试中版本
    const dResult = await otaModel.getDebug(args);
    if (dResult.length !== 0) {
      for (let i = 0; i < dResult.length; i++) {
        const temp = dResult[i];
        if (!(temp.content.trim() === '' || temp.content === null)) {
          const url = verifyMac(temp, args.content);
          if (url !== '') {
            result.url = url;
            result.version = temp.version;
            return result;
          }
        }
      }
    }
    // 正式版本
    let vResult = await otaModel.getFinal(args);
    if (vResult.length === 0) {
      result.code = -1;
      result.msg = '已经是最新版本了';
      return result;
    }
    vResult = vResult[0];
    if (vResult.content.trim() === '' || vResult.content === null) {
      result.url = vResult.file;
      result.version = vResult.version;
      return result;
    }
    const url = verifyMac(vResult, args.content);
    if (url === '') {
      result.code = -1;
      result.msg = 'mac或imei 地址不匹配';
      return result;
    }
    result.url = url;
    result.version = vResult.version;
    return result;
  },

};

module.exports = ota;
