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
            connection.query('SELECT * from Students', (err, rows, feilds) => {
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
            connection.query('SELECT * from Students where studentID = ?',[Id] ,(err, rows, feilds) => {
                console.log(rows[0],rows.length);
                if (err) {
                    message['error'] = true;
                    message['data'] = 'Error Ocured!';
                    res.status(400).json(message);
                }else{
                    if (rows.length > 0){
                        message = JSON.stringify(rows);
                        console.log(rows[0].code)
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

student.get('/subjects/:studentId', (req, res, next) => {
    var Id = req.params.studentId;
    console.log(Id, "a")
    var message = {};
    database.connection.getConnection((err, connection) => {
        if(err){
            message['error'] = true;
            message['data'] = 'Internal Server Error';
            res.status(500).json(message);
        }else{
            // var sql = 'select c.Subject from classes from Classes C left join StudentClasses SC on C.Id = SC.ClassId where SC.studentId = ?' + connection.escape(Id)
            connection.query('SELECT * from Students where studentID = ?',[Id] ,(err, rows, feilds) => {
                console.log(rows[0] ,rows.length);
                if (err) {
                    message['error'] = true;
                    message['data'] = 'Error Ocured!';
                    res.status(400).json(message);
                }else{
                    if (rows.length > 0){
                        message = JSON.stringify(rows);
                        code = rows[0].code;
                        sql = "SELECT subjectCode from Student_Subject where studentCode = ?";
                        connection.query(sql, [code], (err, subjectCodes, feilds) => {
                            console.log(subjectCodes);
                            if(err){
                                message['error'] = true;
                                message['data'] = 'Error Ocured!';
                                res.status(400).json(message);
                            }else{
                                codes = []
                                for(var i = 0; i < subjectCodes.length; i++){
                                    codes.push(subjectCodes[i].subjectCode)
                                }
                                console.log(codes)
                                connection.query("SELECT * from Subjects where code IN (?)", [codes], (err, subjects, feilds) => {
                                    console.log(subjects);
                                    if(err){
                                        message['error'] = true;
                                        message['data'] = 'Error Ocured!';
                                        res.status(400).json(message);
                                    }else{
                                        connection.query("SELECT subjectID from Student_ExamSchedule where studentID = ?", [Id], (err, subjectIDs, feilds) => {
                                            console.log(subjectIDs)
                                            if(err){
                                                message['error'] = true;
                                                message['data'] = 'Error Ocured!';
                                                res.status(400).json(message);
                                            }else{
                                                console.log("success");
                                                // subjects = JSON.stringify(subjects);
                                                for(var i = 0; i < subjects.length; i++){
                                                    console.log(subjects[i])
                                                    if(subjectIDs.includes(subjects[i].subjectID)){
                                                        subjects[i]['isRegister'] = 1;
                                                    }else{
                                                        subjects[i]['isRegister'] = 1;
                                                    }
                                                }
                                                console.log(subjects)
                                                message = subjects;
                                                res.status(200).json(message);
                                            }
                                        });
                                    }
                                });
                            }
                        })
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

student.get('/subject/:subjectID', (req, res, next) => {
    var subjectID = req.params.subjectID;
    console.log(subjectID, "a")
    var message = {};
    database.connection.getConnection((err, connection) => {
        if(err){
            message['error'] = true;
            message['data'] = 'Internal Server Error';
            res.status(500).json(message);
        }else{
            // var sql = 'select c.Subject from classes from Classes C left join StudentClasses SC on C.Id = SC.ClassId where SC.studentId = ?' + connection.escape(Id)
            connection.query('SELECT * from Exam_Schedule e join Subject_ExamSchedule se on e.esID = se.esID where se.SubjectID = ?',[subjectID] ,(err, rows, feilds) => {
                console.log(rows ,rows.length);
                if (err) {
                    message['error'] = true;
                    message['data'] = 'Error Ocured!';
                    res.status(400).json(message);
                }else{
                    message = JSON.stringify(rows);
                    res.status(200).json(message);
                }
            });
            connection.release();
        }
    });
}); 

student.post('/register', (req, res, next) => {
    var subjectID = req.body.subjectID;
    var esID = req.body.esID;
    var studentID = req.body.studentID;
    console.log(subjectID, "a")
    var message = {};
    database.connection.getConnection((err, connection) => {
        if(err){
            message['error'] = true;
            message['data'] = 'Internal Server Error';
            res.status(500).json(message);
        }else{
            // var sql = 'select c.Subject from classes from Classes C left join StudentClasses SC on C.Id = SC.ClassId where SC.studentId = ?' + connection.escape(Id)
            connection.query('SELECT * from Exam_Schedule where esID = ?',[esID] ,(err, rows, feilds) => {
                console.log(rows);
                if (err) {
                    message['error'] = true;
                    message['data'] = 'Error Ocured!';
                    res.status(400).json(message);
                }else{
                    var room_registered = "";
                    var numberSeatsLeft = rows[0].numberSeatsLeft;
                    seatsEachRoomLeft = rows[0].seatsEachRoomLeft;
                    seatsEachRoomLeft = JSON.parse(seatsEachRoomLeft);
                    var keys = Object.keys(seatsEachRoomLeft);
                    console.log(keys)
                    for(var i = 0; i < keys.length; i++){
                        if (seatsEachRoomLeft[keys[i]] > 0){
                            room_registered = keys[i];
                            console.log(keys[i])
                            seatsEachRoomLeft[keys[i]] = seatsEachRoomLeft[keys[i]]-1;
                            numberSeatsLeft = numberSeatsLeft - 1;
                            break; 
                        }else{
                            continue;
                        }
                    }
                    console.log(seatsEachRoomLeft, numberSeatsLeft)
                    connection.query("SELECT roomID from Room where name = (?)", [room_registered], (err, roomID) => {
                        console.log(roomID)
                        if (err) {
                            console.log(err)
                            message['error'] = true;
                            message['data'] = 'Error Ocured!';
                            res.status(400).json(message);
                        }else{
                            var list_values = [];
                            list_values.push(studentID, esID, roomID[0].roomID, subjectID)
                            console.log(list_values)
                            connection.query("INSERT INTO Student_ExamSchedule (studentId, esID, roomID, subjectID) values (?)", [list_values], (err, results) => {
                                if (err) {
                                    console.log(err)
                                    message['error'] = true;
                                    message['data'] = 'Error Ocured!';
                                    res.status(400).json(message);
                                }else{
                                    console.log("insert success");
                                    connection.query("UPDATE Exam_Schedule SET numberSeatsLeft = ?, seatsEachRoomLeft = ? where esID = ?", [numberSeatsLeft, seatsEachRoomLeft, esID], (err, result1) =>{
                                        if (err) {
                                            message['error'] = true;
                                            message['data'] = 'Error Ocured!';
                                            res.status(400).json(message);
                                        }else{
                                            message['data'] = "update success";
                                            res.status(200).json(message);
                                        }
                                    })
                                }
                            })
                        }
                    })
                    
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
                    lowerCaseHeaders:false
                }, function(err,result){
                    if(err) {
                        return res.json({error_code:1,err_desc:err, data: null});
                    } 
                    var values = [];
                    for(var i = 0; i < result.length; i++)
                        if (result[i].username != '')
                            values.push([result[i].username, result[i].password, result[i].code, result[i].name, result[i].vnumail, result[i].role, result[i].dateOfBirth, result[i].gender]);
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
                                                    student1.push(Id, account[2], account[3], account[4], account[6], account[7])
                                                    console.log(Id);
                                                    var insert = "INSERT INTO Students (studentID, code, name, vnumail, dateOfBirth, gender) VALUES (?)"
                                                    connection.query(insert,[student1] ,(err, row) => {
                                                        console.log(Id, '1');
                                                        if(err) {
                                                            console.log(err)
                                                            message['error'] = true;
                                                            message['data'] = 'Insert students fail!'
                                                            return res.status(400).json(message);
                                                        }else{
                                                            console.log("Insert students success!");
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

// subject.post('/create', (req, res, next) => {
//     var Id = req.params.studentID;
//     var message = {};
//     database.connection.getConnection((err, connection) => {
//         if(err){
//             message['error'] = true;
//             message['data'] = 'Internal Server Error';
//             res.status(500).json(message);
//         }else{
//             connection.query('select * from Subjects s join Student_Subject ss on s.subjectID = ss.subjectID where ss.studentId = ?',[Id] ,(err, rows, feilds) => {
//                 console.log(rows);
//                 if (err) {
//                     message['error'] = true;
//                     message['data'] = 'Error Ocured!';
//                     res.status(400).json(message);
//                 }else{
//                     if (rows.lenght > 0){
//                         message = JSON.stringify(rows);
//                         res.status(200).json(message);
//                     }else{
//                         message['data'] = 'Empty';
//                         res.json(message) ;
//                     }
//                 }
//             });
//             connection.release();
//         }
//     });
// }); 

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
