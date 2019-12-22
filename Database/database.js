const mysql = require('mysql');

var connection = mysql.createPool({
    connectionLimit: 10,
    host:'localhost',
    user:'hoangminh',
    password:'minhtran224',
    database:'ExamRegister',
 
});

module.exports.connection = connection;