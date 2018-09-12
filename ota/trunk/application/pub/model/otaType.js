const mysqlHelper = require('../db/mysql-helper');

const otaType = {
  /** *
   * 新增固件类型
   * @param args
   * @return {Promise<void>}
   */
  async add(args) {
    const sql = 'INSERT INTO otatype(chip, project, customer, remark) VALUES(?, ?, ?, ?)';
    const params = [args.chip, args.project, args.customer, args.remark];
    const result = await mysqlHelper.query(sql, params);
    return result;
  },
  /**
   * 获取 同系列 是否存在
   * @param args
   * @return {Promise<void>}
   */
  async getCountBySame(args) {
    const sql = 'SELECT id FROM otatype WHERE chip = ? AND project = ? AND customer = ?';
    const params = [args.chip, args.project, args.customer];
    const result = await mysqlHelper.query(sql, params);
    return result;
  },
  /**
   * 获取 单个 by id
   * @param args
   * @return {Promise<void>}
   */
  async getOtatypeById(args) {
    const sql = 'SELECT id, chip, project, customer, remark, DATE_FORMAT(create_time,\'%Y-%m-%d %T\') AS create_time,  DATE_FORMAT(update_time,\'%Y-%m-%d %T\') AS update_time FROM otatype WHERE id = ?';
    const params = [args.id];
    const result = await mysqlHelper.query(sql, params);
    return result;
  },
  /**
   * 更新 by id
   * @param args
   * @return {Promise<void>}
   */
  async update(args) {
    const sql = 'UPDATE otatype SET project = ?, customer = ?, chip = ?, remark = ? WHERE id = ?';
    const params = [args.project, args.customer, args.chip, args.remark, args.id];
    const result = await mysqlHelper.query(sql, params);
    return result;
  },
  /**
   * 删除 by id
   * @param args
   * @return {Promise<void>}
   */
  async delete(args) {
    const sql = 'DELETE FROM otatype WHERE id = ?';
    const params = [args.id];
    const result = await mysqlHelper.query(sql, params);
    return result;
  },
  /**
   * 分页获取列表
   * @param args
   * @return {Promise<void>}
   */
  async list(args) {
    const sql = 'SELECT id, chip, project, customer, remark, DATE_FORMAT(create_time,\'%Y-%m-%d %T\') AS create_time,  DATE_FORMAT(update_time,\'%Y-%m-%d %T\') AS update_time FROM otatype';
    const result = await mysqlHelper.query(sql);
    return result;
  },
  /** *
   * 获取总数
   * @return {Promise<void>}
   */
  async total() {
    const sql = 'SELECT COUNT(id) AS num FROM otatype';
    const result = await mysqlHelper.query(sql);
    return result;
  },
};
module.exports = otaType;
