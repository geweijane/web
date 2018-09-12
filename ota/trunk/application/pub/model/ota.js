const mysqlHelper = require('../db/mysql-helper');

const ota = {
  /** *
   * 新增ota
   * @param args
   * @return {Promise<void>}
   */
  async add(args) {
    const sql = 'INSERT INTO ota(version, type, file, remark, status) VALUES(?, ?, ?, ?, ?)';
    const params = [args.version, args.type, args.file, args.remark, args.status];
    const result = await mysqlHelper.query(sql, params);
    return result;
  },
  /** *
   * 修改ota
   * @param args
   * @return {Promise<void>}
   */
  async update(args) {
    let sql = 'UPDATE ota SET';
    const fileds = [];
    const params = [];
    for (const index in args) {
      if (index !== 'id') {
        fileds.push(` ${index} = ?`);
        params.push(args[index]);
      }
    }
    sql = `${sql + fileds.join(', ')} WHERE id = ?`;
    params.push(args.id);
    const result = await mysqlHelper.query(sql, params);
    return result;
  },
  /**
   * 获取单个ota by id
   * @param args
   * @return {Promise<void>}
   */
  async getById(args) {
    const sql = 'SELECT o.id, o.version, o.type, o.file, o.remark, o.status, o.content, DATE_FORMAT(o.create_time,\'%Y-%m-%d %T\') AS create_time,  DATE_FORMAT(o.update_time,\'%Y-%m-%d %T\') AS update_time, t.chip, t.project, t.customer, c.type AS chip_type FROM ota o JOIN otatype t ON o.type = t.id JOIN chip c ON c.chip = t.chip WHERE o.id = ?';
    const params = [args.id];
    const result = await mysqlHelper.query(sql, params);
    return result;
  },
  /** *
   * 获取ota列表
   * @param args
   * @return {Promise<void>}
   */
  async list(args) {
    let sql = 'SELECT o.id, o.version, o.type, o.file, o.remark, o.status, o.content, DATE_FORMAT(o.create_time,\'%Y-%m-%d %T\') AS create_time,  DATE_FORMAT(o.update_time,\'%Y-%m-%d %T\') AS update_time, t.chip, t.project, t.customer, c.type AS chip_type FROM ota o JOIN otatype t ON o.type = t.id JOIN chip c ON c.chip = t.chip';
    let params = [];
    if (args.status !== undefined) {
      sql += ' WHERE o.status = ?';
      params.push(args.status);
    }
    if (args.type !== undefined) {
      sql += ' AND o.type = ?';
      params.push(args.type);
    }
    sql += ' ORDER BY create_time ASC LIMIT ?, ?';
    params = params.concat([args.page_start, args.page_size]);
    const result = await mysqlHelper.query(sql, params);
    return result;
  },
  /**
   * 获取ota总数
   * @return {Promise<void>}
   */
  async total() {
    const sql = 'SELECT COUNT(id) AS num FROM ota';
    const result = await mysqlHelper.query(sql);
    return result;
  },
  /** *
   * 获取形同条件的ota 版本号 和 类型为同个ota
   * @param arg
   * @return {Promise<void>}
   */
  async getCountBySame(args) {
    const sql = 'SELECT COUNT(id) AS num FROM ota WHERE version = ? AND type = ? ';
    const params = [args.version, args.type];
    const result = await mysqlHelper.query(sql, params);
    return result;
  },
  /** **
   * 获取正式版本
   * @param args
   * @return {Promise<void>}
   */
  async getFinal(args) {
    const sql = 'SELECT id, file, content, version FROM ota WHERE 10000*SUBSTRING_INDEX(version,\'.\',1)+'
      + '100*SUBSTRING(SUBSTRING_INDEX(version,\'.\',2),INSTR(SUBSTRING_INDEX(version,\'.\',2),\'.\')+1)'
      + '+REVERSE(SUBSTRING_INDEX(REVERSE(version),\'.\',1)) = (SELECT MAX( 10000*SUBSTRING_INDEX(version,\'.\',1)+'
      + '100*SUBSTRING(SUBSTRING_INDEX(version,\'.\',2),INSTR(SUBSTRING_INDEX(version,\'.\',2),\'.\')+1)+'
      + 'REVERSE(SUBSTRING_INDEX(REVERSE(version),\'.\',1)))FROM ota WHERE status = 3 AND type = ? AND '
      + '10000*SUBSTRING_INDEX(version,\'.\',1)+100*SUBSTRING(SUBSTRING_INDEX(version,\'.\',2),'
      + 'INSTR(SUBSTRING_INDEX(version,\'.\',2),\'.\')+1)+REVERSE(SUBSTRING_INDEX(REVERSE(version),\'.\',1)) > '
      + '10000*SUBSTRING_INDEX(?,\'.\',1)+100*SUBSTRING(SUBSTRING_INDEX(?,\'.\',2),INSTR(SUBSTRING_INDEX(?,\'.\',2),\'.\')+1)+'
      + 'REVERSE(SUBSTRING_INDEX(REVERSE(?),\'.\',1)))';
    const params = [args.type, args.version, args.version, args.version, args.version, args.version];
    const result = await mysqlHelper.query(sql, params);
    return result;
  },
  /** *
   * 获取调试中版本
   * @param args
   * @return {Promise<void>}
   */
  async getDebug(args) {
    const sql = 'SELECT id, file, content, version FROM ota WHERE status = 1 AND 10000*SUBSTRING_INDEX(version,\'.\',1)+'
      + '100*SUBSTRING(SUBSTRING_INDEX(version,\'.\',2),INSTR(SUBSTRING_INDEX(version,\'.\',2),\'.\')+1)'
      + '+REVERSE(SUBSTRING_INDEX(REVERSE(version),\'.\',1)) > (SELECT MAX( 10000*SUBSTRING_INDEX(version,\'.\',1)+'
      + '100*SUBSTRING(SUBSTRING_INDEX(version,\'.\',2),INSTR(SUBSTRING_INDEX(version,\'.\',2),\'.\')+1)+'
      + 'REVERSE(SUBSTRING_INDEX(REVERSE(version),\'.\',1)))FROM ota WHERE status = 3 AND type = ? AND '
      + '10000*SUBSTRING_INDEX(version,\'.\',1) +100*SUBSTRING(SUBSTRING_INDEX(version,\'.\',2),'
      + 'INSTR(SUBSTRING_INDEX(version,\'.\',2),\'.\')+1)+REVERSE(SUBSTRING_INDEX(REVERSE(version),\'.\',1))'
      + ' > 10000*SUBSTRING_INDEX(?,\'.\',1)+100*SUBSTRING(SUBSTRING_INDEX(?,\'.\',2),INSTR(SUBSTRING_INDEX(?,\'.\',2),\'.\')+1)+'
      + 'REVERSE(SUBSTRING_INDEX(REVERSE(?),\'.\',1)))';
    const params = [args.type, args.version, args.version, args.version, args.version];
    const result = await mysqlHelper.query(sql, params);
    return result;
  },
};

module.exports = ota;
