/**
 * Created by gaika on 30.09.2017.
 */
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var express = require('express');


var connections = {};
var room = 'default';
app.use(express.static('client'));

io.on('connection', function(connection){

    connection.on('login', function(data) {
        console.log('login ' + data);
        var parseData = JSON.parse(data);
        connections[connection.id] = connection;
        connection.name = parseData.name;
        connection.emit('login', {success: true});
        connection.room = room;
        connection.join(connection.room);
        connection.broadcast.to(connection.room).emit('new', {connectionId: connection.id, name: parseData.name});
    });

    connection.on('disconnect', function() {
        console.log('user disconnected');
        connection.broadcast.to(connection.room).emit('leave', {connectionId: connection.id});
        delete connections[connection.id];
    });

    connection.on('offer', function(data) {
        var parseData = JSON.parse(data);
        var conn = connections[parseData.connectionId];
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

    connection.on('answer', function(data){
        var parseData = JSON.parse(data);

        console.log('answer');
        var conn = connections[parseData.connectionId];
        if (conn) {
            conn.emit('answer', {
                answer: parseData.answer,
                connectionId: connection.id
            });
        }
    });

    connection.on('candidate', function(data) {
        console.log('candidate');
        var parseData = JSON.parse(data);
        var conn = connections[parseData.connectionId];
        if (conn) {
            conn.emit('candidate', {
                candidate: parseData.candidate,
                connectionId: connection.id
            });
        }
    });

});

http.listen(9001, function(){
    console.log('listening on *:3000');
});