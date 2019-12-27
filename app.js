const express = require('express');
const bodyParser = require('body-parser');

const subject = require('./api/subject');
const student = require('./api/student');
const room = require('./api/room');
const exam_schedule = require('./api/exam_schedule');
const User = require('./api/user');
const app = express();
app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json());

app.use('/students', student);
app.use('/subjects', subject);
app.use('/room', room);
app.use('/exam_schedule', exam_schedule);
app.use('/subject', subject);
app.use('/student', student);
app.use('/room', room);
app.use('/user', User);

module.exports = app;