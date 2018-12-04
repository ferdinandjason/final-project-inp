'use strict'

const express = require('express');
const io = require('socket.io');
const PORT = 8080;

const app = express();

app.use(express.static(__dirname + '/'));

const server = app.listen(PORT);

let socket = io.listen(server);

socket.on('connection', (client) => {
    console.log('Connection to client stablished!');

    client.on('connect', data => {
        console.log(data)
    })

    client.on('message',function(event){ 
        console.log('Received message from client!',event);
    });

    client.on('disconnect',function(){
        console.log('Server has disconnected');
    });
});