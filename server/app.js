/**
 * Created by gaika on 30.09.2017.
 */
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const express = require('express');


const connections = {};
const room = 'default';
app.use(express.static('client'));

io.on('connection', connection => {

    connection.on('login', data => {
        console.log('login ' + data);
        const parseData = JSON.parse(data);
        connections[connection.id] = connection;
        connection.name = parseData.name;
        connection.emit('login', {success: true});
        connection.room = room;
        connection.join(connection.room);
        connection.broadcast.to(connection.room).emit('new', {connectionId: connection.id, name: parseData.name});
    });

    connection.on('disconnect', () => {
        console.log('user disconnected');
        connection.broadcast.to(connection.room).emit('leave', {connectionId: connection.id});
        delete connections[connection.id];
    });

    connection.on('offer', data => {
        const parseData = JSON.parse(data);
        const conn = connections[parseData.connectionId];
        console.log('offer');
        if (conn) {
            console.log('offer on conn');
            conn.emit('offer', {
                connectionId: connection.id,
                name: connection.name,
                offer: parseData.offer
            });
        }
    });

    connection.on('answer', data => {
        const parseData = JSON.parse(data);

        console.log('answer');
        const conn = connections[parseData.connectionId];
        if (conn) {
            conn.emit('answer', {
                answer: parseData.answer,
                connectionId: connection.id
            });
        }
    });

    connection.on('candidate', data => {
        console.log('candidate');
        const parseData = JSON.parse(data);
        const conn = connections[parseData.connectionId];
        if (conn) {
            conn.emit('candidate', {
                candidate: parseData.candidate,
                connectionId: connection.id
            });
        }
    });

});

http.listen(9001, () => {
    console.log('listening on *:9001');
});
