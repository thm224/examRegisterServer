const express = require('express');
const database = require('../Database/database')
const subject = express.Router();


subject.get('/', (req, res, next) => {
    var message = {}
    database.connection.getConnection((err, connection) => {
        if (err) {
            message['error'] = true;
            message['data'] = 'Internal Server Error';
            res.status(500).json(message);
        }else{
            connection.query('select * from Subjects', (err, rows, feilds) => {
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

subject.get('/:studentID', (req, res, next) => {
    var Id = req.params.studentID;
    var message = {};
    database.connection.getConnection((err, connection) => {
        if(err){
            message['error'] = true;
            message['data'] = 'Internal Server Error';
            res.status(500).json(message);
        }else{
            connection.query('select * from Subjects s join Student_Subject ss on s.subjectID = ss.subjectID where ss.studentId = ?',[Id] ,(err, rows, feilds) => {
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

subject.post('/:create', (req, res, next) => {
    var Id = req.params.studentID;
    var message = {};
    database.connection.getConnection((err, connection) => {
        if(err){
            message['error'] = true;
            message['data'] = 'Internal Server Error';
            res.status(500).json(message);
        }else{
            connection.query('select * from Subjects s join Student_Subject ss on s.subjectID = ss.subjectID where ss.studentId = ?',[Id] ,(err, rows, feilds) => {
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


subject.post('/upload_students', (req, res, next) => {
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
                }, function(err,result){
                    if(err) {
                        return res.json({error_code:1,err_desc:err, data: null});
                    } 
                    var values = [];
                    var subjectCode = result[0].subjectCode;
                    for(var i = 0; i < result.length; i++)
                        if (result[i].studentCode != ''){
                            values.push([subjectCode, result[i].studentCode, result[i].can_join_exam]);
                        }
                        else break;
                    var message = {};
                    console.log(values)
                    database.connection.getConnection((err, connection) => {
                        if(err){
                            console.log(err)
                            message['error'] = true;
                            message['data'] = 'Internal Server Error';
                            res.status(500).json(message);
                        }else{                        
                            var sql = "INSERT INTO Student_Subject (subjectCode, studentCode, can_join_exam) VALUES (?)";
                            connection.query(sql, values, (err, rowss) => {
                                if(err){
                                    console.log(err)
                                    message['error'] = true;
                                    message['data'] = 'error occur!';
                                    return res.status(400).json(message);
                                }else{
                                    message['error'] = false;
                                    message['data'] = "Upload success";
                                    res.status(200).json(message);
                                    connection.release();
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

subject.put('/', (req, res, next) => {
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
                            values.push([result[i].id, result[i].username, result[i].password, result[i].code, result[i].vnumail, result[i].phone, result[i].role, result[i].name]);
                        else break;
                    var message = {};
                    // console.log(values)
                    database.connection.getConnection((err, connection) => {
                        if(err){
                            message['error'] = true;
                            message['data'] = 'Internal Server Error';
                            res.status(500).json(message);
                        }else{
                            var Id;
                            for (var i = 0; i < values.length; i++){
                                let account = values[i];
                                var lecturer = [];
                                lecturer.push(account[0], account[1], account[2], account[6])
                                console.log(lecturer)
                                var sql = "UPDATE Users SET userName = ?, password = ?, role = ? where Id_Users = ?"
                                connection.query(sql,[lecturer[1], lecturer[2], lecturer[3], lecturer[0]] ,(err, rows) => {
                                    console.log(rows.affectedRows);
                                    if (err) {
                                        message['error'] = true;
                                        message['data'] = 'Update users fail!';
                                        return res.status(400).json(message);
                                    }else{
                                        var lecturer1 = [];
                                        lecturer1.push(account[3], account[5],account[4],account[6], account[7], account[0]);
                                        console.log(lecturer1);
                                        var edit = "UPDATE Lecturers SET Code = ?, Phone = ?, Vnumail = ?, Role = ?, Name = ? where Lecturers.Id_Lecturers = ?"
                                        connection.query(edit,[lecturer1[0], lecturer1[1], lecturer1[2], lecturer1[3], lecturer1[4], lecturer1[5]] ,(err, row) => {
                                            console.log(Id, row);
                                            if(err) {
                                                message['error'] =true;
                                                message['data'] = 'Update lecturers fail!';
                                                return res.status(400).json(message);
                                            }else{
                                                console.log("Update lecturers success!");
                                            }
                                        });
                                    }
                            });
                        }
                            message['error'] = false;
                            message['data'] = 'Update lecturers success!';
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


subject.delete('/:lecturerId', (req, res, next) => {
    var Id = req.params.lecturerId;
    var message = {};
    database.connection.getConnection((err, connection) => {
        if(err){
            message['error'] = true;
            message['data'] = 'Internal Server Error';
            res.status(500).json(message);
        }else{
            var sql = "DELETE FROM Lecturers WHERE Id_Lecturers = ?";
            connection.query(sql,[Id] ,function (err, result) {
                if (err) throw err;
                console.log("Number of records deleted: " + result.affectedRows);
            });
            connection.release();
        }
    });
});

module.exports = subject;