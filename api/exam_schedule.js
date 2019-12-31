const express = require('express');
const database = require('../Database/database')
const exam_schedule = express.Router();

exam_schedule.post('/create', (req, res, next) => {
    var subjectID = req.body.subjectID;
    var exam_schedule = req.body.exam_schedule;
    var start_time = exam_schedule.start_time;
    var end_time = exam_schedule.end_time;
    var rooms = req.body.rooms;
    var message = {};
    database.connection.getConnection((err, connection) => {
        if(err){
            message['error'] = true;
            message['data'] = 'Internal Server Error';
            res.status(500).json(message);
        }else{
            connection.query('SELECT * from Room where roomID in (?)',[rooms] ,(err, rows, feilds) => {
                console.log(rows);
                if (err) {
                    message['error'] = true;
                    message['data'] = 'Error Ocured!';
                    res.status(400).json(message);
                }else{
                    totalSeats = 0;
                    seatsEachRoomLeft = {};
                    for(var i = 0; i < rows.length; i++){
                        totalSeats += rows[i].numberSeats;
                        seatsEachRoomLeft[rows[i].name] = rows[i].numberSeats;
                    }
                    seatsEachRoomLeft = JSON.stringify(seatsEachRoomLeft)
                    console.log(totalSeats, seatsEachRoomLeft);
                    var list_value = [];
                    list_value.push(1, totalSeats, start_time, end_time, seatsEachRoomLeft)
                    connection.query("INSERT INTO Exam_Schedule (examID, numberSeatsLeft, startTime, endTime, seatsEachRoomLeft) VALUES (?)", [list_value], (err, result, feilds) => {
                        if (err) {
                            console.log(err)
                            message['error'] = true;
                            message['data'] = 'Error Ocured!';
                            res.status(400).json(message);
                        }else{
                            var esID = result.insertId;
                            console.log("success");
                            connection.query("INSERT INTO Subject_ExamSchedule (subjectID, esID) VALUES (?)", [[subjectID, esID]], (err, result1) => {
                                if (err) {
                                    message['error'] = true;
                                    message['data'] = 'Error Ocured!';
                                    res.status(400).json(message);
                                }else{
                                    var list_room_es = [];
                                    for(var i = 0; i < rows.length; i++){
                                        list_room_es.push([esID, rows[i].roomID]);
                                    }
                                    console.log(list_room_es,"success1");
                                    connection.query("INSERT INTO ExamSchedule_Room (esID, roomID) VALUES (?)", list_room_es, (err, result2) =>{
                                        if (err) {
                                            console.log(err)
                                            message['error'] = true;
                                            message['data'] = 'Error Ocured!';
                                            res.status(400).json(message);
                                        }else{
                                            console.log("success2", result2)
                                            message['error'] = false;
                                            message['data'] = 'Insert success!';
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

module.exports = exam_schedule;