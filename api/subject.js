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

subject.get('/:subjectID', (req, res, next) => {
    var Id = req.params.subjectID;
    var message = {};
    database.connection.getConnection((err, connection) => {
        if(err){
            message['error'] = true;
            message['data'] = 'Internal Server Error';
            return res.status(500).json(message);
        }else{
            connection.query('select * from Subjects where subjectID = ?',[Id] ,(err, rows, feilds) => {
                console.log(rows.length);
                if (err) {
                    console.log(err)
                    message['error'] = true;
                    message['data'] = 'Error Ocured!';
                    return res.status(400).json(message);
                }else{
                    if (rows.length > 0){
                        console.log(rows)
                        message = JSON.stringify(rows);
                        return res.status(200).json(message);
                    }else{
                        message['data'] = 'Empty';
                        return res.json(message) ;
                    }
                }
            });
            connection.release();
        }
    });
}); 

subject.post('/create', (req, res, next) => {
    var name = req.body.name;
    var code = req.body.code;
    var lecturer = req.body.lecturer;
    var credits = req.body.credits;
    var message = {};
    database.connection.getConnection((err, connection) => {
        if(err){
            message['error'] = true;
            message['data'] = 'Internal Server Error';
            res.status(500).json(message);
        }else{
            var checkExist = "SELECT code from Subjects where code = ?";
            console.log(name,code)
            connection.query(checkExist, [code], (err, results) => {
                if(err){
                    message['error'] = true;
                    message['data'] = "Internal Server Error";
                    console.log(err);
                    return res.status(400).json(message);
                }else{
                    console.log(results)
                    if (results.length > 0){
                        message['error'] = true;
                        message['data'] = "Subject is already exist!";
                        return res.status(400).json(message);
                    }else{
                        var insert = "INSERT INTO Subjects (name, code, lecturer, credits) VALUES (?)";
                        var subjects = []
                        subjects.push(name, code, lecturer, credits)
                        connection.query(insert, [subjects], (err, rows) =>{
                            if(err){
                                message['error'] = true;
                                message['data'] = "Insert subject fail!";
                                console.log(err);
                                return res.status(400).json(message);
                            }else{
                                message['error'] = false;
                                message['data'] = "Insert subject success";
                                return res.status(200).json(message);
                            }
                        });
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
                    console.log(result)
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
                            for (var i = 0; i < values.length; i++){
                                console.log(values[i])                        
                                var sql = "INSERT INTO Student_Subject (subjectCode, studentCode, can_join_exam) VALUES (?)";
                                connection.query(sql, [values[i]], (err, rowss) => {
                                    if(err){
                                        console.log(err)
                                        message['error'] = true;
                                        message['data'] = 'error occur!';
                                        return res.status(400).json(message);
                                    }else{
                                        console.log("Insert students success!");
                                    }
                                });

                            }
                            message['error'] = false;
                            message['data'] = "Upload success";
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