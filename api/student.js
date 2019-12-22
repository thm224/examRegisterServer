const express = require('express');
const database = require('../Database/database')
const student = express.Router();

student.get('/', (req, res, next) => {
    var message = {}
    database.connection.getConnection((err, connection) => {
        if (err) {
            message['error'] = true;
            message['data'] = 'Internal Server Error';
            res.status(500).json(message);
        }else{
            connection.query('select * from Students', (err, rows, feilds) => {
                console.log(rows);
                if (err) {
                    message['error'] = true;
                    message['data'] = 'Error Ocured!';
                    res.status(400).json(message);
                }else{
                    if (rows != 'undefined'){
                        message = JSON.stringify(rows);
                        res.status(200).json(message);
                    }else{
                        message['data'] = 'Empty';
                        res.json(message);
                    }
                }
            });
            connection.release();
        }
    });
});

student.get('/:studentId', (req, res, next) => {
    var Id = req.params.studentId;
    var message = {};
    database.connection.getConnection((err, connection) => {
        if(err){
            message['error'] = true;
            message['data'] = 'Internal Server Error';
            res.status(500).json(message);
        }else{
            // var sql = 'select c.Subject from classes from Classes C left join StudentClasses SC on C.Id = SC.ClassId where SC.studentId = ?' + connection.escape(Id)
            connection.query('select * from Students where studentID = ?',[Id] ,(err, rows, feilds) => {
                console.log(rows);
                if (err) {
                    message['error'] = true;
                    message['data'] = 'Error Ocured!';
                    res.status(400).json(message);
                }else{
                    if (rows.lenght > 0){
                        message = JSON.stringify(rows);
                        res.status(200).json(message);
                    }else{
                        message['data'] = 'Empty';
                        res.json(message) ;
                    }
                }
            });
            connection.release();
        }
    });
}); 
var multer = require('multer');
var xlstojson = require("xls-to-json-lc");
var xlsxtojson = require("xlsx-to-json-lc");
var storage = multer.diskStorage({ //multers disk storage settings
    destination: function (req, file, cb) {
        cb(null, './uploads/')
    },
    filename: function (req, file, cb) {
        var datetimestamp = Date.now();
        cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1])
    }
});
var upload = multer({ //multer settings
                storage: storage,
                fileFilter : function(req, file, callback) { //file filter
                    if (['xls', 'xlsx'].indexOf(file.originalname.split('.')[file.originalname.split('.').length-1]) === -1) {
                        return callback(new Error('Wrong extension type'));
                    }
                    callback(null, true);
                }
            }).single('file');

student.post('/create', (req, res, next) => {
    var exceltojson;
        upload(req,res,function(err){
            if(err){
                 res.json({error_code:1,err_desc:err});
                 return;
            }
            /** Multer gives us file info in req.file object */
            if(!req.file){
                res.json({error_code:1,err_desc:"No file passed"});
                return;
            }
            /** Check the extension of the incoming file and 
             *  use the appropriate module
             */
            if(req.file.originalname.split('.')[req.file.originalname.split('.').length-1] === 'xlsx'){
                exceltojson = xlsxtojson;
            } else {
                exceltojson = xlstojson;
            }
            try {
                exceltojson({
                    input: req.file.path,
                    output: null, //since we don't need output.json
                    lowerCaseHeaders:true
                }, function(err,result){
                    if(err) {
                        return res.json({error_code:1,err_desc:err, data: null});
                    } 
                    var values = [];
                    for(var i = 0; i < result.length; i++)
                        if (result[i].username != '')
                            values.push([result[i].username, result[i].password, result[i].code, result[i].name, result[i].vnumail, result[i].role, result[i].courses]);
                        else break;
                    var message = {};
                    console.log(values)
                    database.connection.getConnection((err, connection) => {
                        if(err){
                            message['error'] = true;
                            message['data'] = 'Internal Server Error';
                            return res.status(500).json(message);
                        }else{
                            var Id;
                            var userNames = [];
                            var checkSql = "SELECT userName from Users";
                            connection.query(checkSql, (err, rowss) => {
                                if(err){
                                    message['error'] = true;
                                    message['data'] = 'error occur!';
                                    return res.status(400).json(message);
                                }else{
                                    userNames = rowss;
                                    for (var i = 0; i < values.length; i++){
                                        let account = values[i];
                                        var student = [];
                                        student.push(account[0], account[1], account[5])
                                        console.log(student)
                                        var checkIfExist = false;
                                        for(var j = 0; j < userNames.length; j++){
                                            if(userNames[j].userName == student[0]){
                                                checkIfExist = true;
                                                break;
                                            }else continue;
                                        }
                                        if(checkIfExist == true){
                                            console.log('UserName is already exist!');
                                            break;
                                        }
                                        else{
                                            var sql = "INSERT INTO Users (userName, password, role) VALUES (?)";
                                            connection.query(sql,[student] ,(err, rows) => {
                                                console.log(rows.affectedRows);
                                                if (err) {
                                                    message['error'] = true;
                                                    message['data'] = 'Insert users fail!';
                                                    return res.status(400).json(message);
                                                }else{
                                                    Id = rows.insertId;
                                                    var student1 = [];
                                                    student1.push(Id, account[2], account[3], account[4])
                                                    console.log(Id);
                                                    var insert = "INSERT INTO Students (studentID, code, name, vnumail) VALUES (?)"
                                                    connection.query(insert,[student1] ,(err, row) => {
                                                        console.log(Id, '1');
                                                        if(err) {
                                                            message['error'] = true;
                                                            message['data'] = 'Insert students fail!'
                                                            return res.status(400).json(message);
                                                        }else{
                                                            console.log("Insert students success!");
                                                            courses = account[6];
                                                            courses = courses.split(",");
                                                            for(var k = 0; k < courses.length; k++){
                                                                courses[k] = courses[k].trim();
                                                            }
                                                            console.log(courses)
                                                            var findSubjectID = "SELECT subjectID from Subjects where code IN (?)"
                                                            connection.query(findSubjectID, [courses], (err, listID) => {
                                                                if(err){
                                                                    message['error'] = true;
                                                                    message['data'] = 'Insert studentSubject fail!'
                                                                    return res.status(400).json(message);
                                                                }else{
                                                                    console.log("select subjectID success!")
                                                                    console.log(listID)
                                                                    listSS = []
                                                                    for(var m = 0; m < listID.length; m ++){
                                                                        listSS.push([Id, listID[m].subjectID, 1])
                                                                    }
                                                                    console.log(listSS)
                                                                    var insertSS = "INSERT INTO Student_Subject (studentID, subjectID, can_join_exam) VALUES (?)"
                                                                    connection.query(insertSS, listSS, (err, result) => {
                                                                        if(err) {
                                                                            message['error'] = true;
                                                                            message['data'] = 'Insert students fail!';
                                                                            console.log(err)
                                                                            // return res.status(400).json(message);
                                                                        }else{
                                                                            console.log("Insert studentSubject success!")
                                                                        }
                                                                    })
                                                                }
                                                            })
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                    }
                                        if(checkIfExist == true){
                                            message['error'] = true;
                                            message['data'] = 'UserName is already exist!';
                                            res.status(400).json(message);
                                        }else{
                                            message['error'] = false;
                                            message['data'] = 'Insert students success!';
                                            res.status(200).json(message);
                                            connection.release();
                                        }
                                }
                            });
                        }
                    });
                });
            } catch (e){
                res.json({error_code:1,err_desc:"Corupted excel file"});
            }
        })
});

student.put('/', (req, res, next) => {
    var exceltojson;
        upload(req,res,function(err){
            if(err){
                 res.json({error_code:1,err_desc:err});
                 return;
            }
            if(!req.file){
                res.json({error_code:1,err_desc:"No file passed"});
                return;
            }
            if(req.file.originalname.split('.')[req.file.originalname.split('.').length-1] === 'xlsx'){
                exceltojson = xlsxtojson;
            } else {
                exceltojson = xlstojson;
            }
            try {
                exceltojson({
                    input: req.file.path,
                    output: null, //since we don't need output.json
                    lowerCaseHeaders:true
                }, function(err,result){
                    if(err) {
                        return res.json({error_code:1,err_desc:err, data: null});
                    } 
                    var values = [];
                    for(var i = 0; i < result.length; i++)
                        if (result[i].username != '')
                            values.push([result[i].id, result[i].username, result[i].password, result[i].code, result[i].vnumail, result[i].content, result[i].role, result[i].name]);
                        else break;
                    var message = {};
                    // console.log(values)
                    database.connection.getConnection((err, connection) => {
                        if(err){
                            message['error'] = true;
                            message['data'] = 'Internal Server Error';
                            return res.status(500).json(message);
                        }else{
                            var Id;
                            for (var i = 0; i < values.length; i++){
                                let account = values[i];
                                var student = [];
                                student.push(account[0], account[1], account[2], account[6])
                                console.log(student)
                                var sql = "UPDATE Users SET userName = ?, password = ?, role = ? where userID = ?"
                                connection.query(sql,[student[1], student[2], student[3], student[0]] ,(err, rows) => {
                                    console.log(rows.affectedRows);
                                    if (err) {
                                        message['error'] = true;
                                        message['data'] = 'Update user fail!';
                                        return res.status(400).json(message);
                                    }else{
                                        var student1 = [];
                                        student1.push(account[3], account[5],account[4],account[6], account[7], account[0]);
                                        console.log(student1);
                                        var edit = "UPDATE Students SET Code = ?, Content = ?, Vnumail = ?, Role = ?, Name = ? where Students.Id_Students = ?"
                                        connection.query(edit,[student1[0], student1[1], student1[2], student1[3], student1[4], student1[5]] ,(err, row) => {
                                            console.log(Id, row);
                                            if(err) {
                                                message['error'] =true;
                                                message['data'] = 'Update student fail!';
                                                return res.status(400).json(message);
                                            }else{
                                                console.log("Update student success!");
                                            }
                                        });
                                    }
                            });
                        }
                            message['error'] = false;
                            message['data'] = 'Update student success!';
                            res.status(200).json(message);
                            connection.release();
                        }
                    });
                });
            } catch (e){
                res.json({error_code:1,err_desc:"Corupted excel file"});
            }
        })
});

student.delete('/:studentId', (req, res, next) => {
    var Id = req.params.studentId;
    var message = {};
    database.connection.getConnection((err, connection) => {
        if(err){
            message['error'] = true;
            message['data'] = 'Internal Server Error';
            res.status(500).json(message);
        }else{
            var sql = "DELETE FROM Students WHERE studentID = ?";
            connection.query(sql,[Id] ,function (err, result) {
                if (err) throw err;
                console.log("Number of records deleted: " + result.affectedRows);
                var deleteUser = "DELETE FROM Users WHERE userID = ?";
                connection.query(deleteUser, [Id], (err, result1) => {
                    if(err){
                        message['error'] = true;
                        res.status(400).json(message);
                    }else{
                        console.log(result1,"delete student success");
                        message['data'] = "delete student success";
                        res.status(200).json(message);
                    }
                });
            });
            connection.release();
        }
    });
});
// student.get('/classes', (req, res, next) => {
//     var id = req.body.id;
// });

// student.post('/create', (req, res, next) => {

// });
// student.get('/classes', (rep, res, next) => {
    
//     });
// });

// student.post('/create', (rep, res, next) => {

// });
module.exports = student;
