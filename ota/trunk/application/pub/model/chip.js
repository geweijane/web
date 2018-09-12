const mysqlHelper = require('../db/mysql-helper');

const chip = {
  async add(args) {
    const sql = 'INSERT INTO chip(chip, type) VALUES(?, ?)';
    const params = [args.chip, args.type];
    const result = await mysqlHelper.query(sql, params);
    return result;
  },
  async list() {
    const sql = 'SELECT chip, type FROM chip';
    const result = await mysqlHelper.query(sql);
    return result;
  },
  async getByChip(args) {
    const sql = 'SELECT chip, type FROM chip WHERE chip = ?';
    const params = [args.chip];
    const result = await mysqlHelper.query(sql, params);
    return result;
  },
  async update(args) {
    const sql = 'UPDATE chip SET type = ? WHERE chip = ?';
    const params = [args.type, args.chip];
    const result = await mysqlHelper.query(sql, params);
    return result;
  },
};

module.exports = chip;
