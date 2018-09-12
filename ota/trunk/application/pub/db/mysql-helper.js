const mysql = require('mysql');
const config = require('./../config/config.js');

const pool = mysql.createPool(config.MYSQL);

const query = function (sql, args) {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        resolve(err);
      } else {
        connection.query(sql, args, (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
          connection.release();
        });
      }
    });
  });
};

module.exports = {
  query,
};
