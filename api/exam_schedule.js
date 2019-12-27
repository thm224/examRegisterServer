const express = require('express');
const database = require('../Database/database')
const exam_schedule = express.Router();

exam_schedule.post('/create', (req, res, next) => {
    var subjectID = req.body.subjectID;
    var exam_schedule = req.body.exam_schedule;
    var rooms = req.body.rooms;
    var message = {};
    database.connection.getConnection((err, connection) => {
        if(err){
            message['error'] = true;
            message['data'] = 'Internal Server Error';
            res.status(500).json(message);
        }else{
            connection.query('SELECT numberSeats from Room where roomID in (?)',[rooms] ,(err, rows, feilds) => {
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

module.exports = exam_schedule;