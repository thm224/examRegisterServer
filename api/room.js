const express = require('express');
const database = require('../Database/database')
const room = express.Router();


room.get('/', (req, res, next) => {
    var message = {}
    database.connection.getConnection((err, connection) => {
        if (err) {
            message['error'] = true;
            message['data'] = 'Internal Server Error';
            res.status(500).json(message);
        }else{
            connection.query('select * from Survey', (err, rows, feilds) => {
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
room.post('/create', (req, res, next) => {
                var message = {};
                var name = req.body.name;
                var numberSeats = req.body.numberSeats;
                console.log(name, numberSeats )
                database.connection.getConnection((err, connection) => {
                        if(err){
                            message['error'] = true;
                            message['data'] = 'Internal Server Error';
                            res.status(500).json(message);
                        }else{
                            var checkExist = "SELECT name from Room where name = ?";
                            console.log(name)
                            connection.query(checkExist, [name], (err, results) => {
                                if(err){
                                    message['error'] = true;
                                    message['data'] = "Internal Server Error";
                                    console.log(err);
                                    return res.status(400).json(message);
                                }else{
                                    console.log(results)
                                    if (results.length > 0){
                                        message['error'] = true;
                                        message['data'] = "Room is already exist!";
                                        return res.status(400).json(message);
                                    }else{
                                        var insert = "INSERT INTO Room (name, numberSeats) VALUES (?)";
                                        var room = []
                                        room.push(name, numberSeats)
                                        connection.query(insert, [room], (err, rows) =>{
                                            if(err){
                                                message['error'] = true;
                                                message['data'] = "Insert room fail!";
                                                console.log(err);
                                                res.status(400).json(message);
                                            }else{
                                                message['error'] = false;
                                                message['data'] = "Insert rooom success";
                                                res.status(200).json(message);
                                            }
                                        });
                                    }
                                }
                            });
                            connection.release();
                        }
                    });
            });


module.exports = room;