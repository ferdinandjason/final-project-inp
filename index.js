'use strict'

const express = require('express');
const io = require('socket.io');
const PORT = 8080;

const app = express();

app.use(express.static(__dirname + '/'));

const server = app.listen(PORT);

let socket = io.listen(server);

socket.on('connection', (client) => {
    // console.log('Connection to client stablished!');

    // client.on('button.planet.click',function(event){ 
    //     console.log(event);
    //     window.dispatchEvent(global.travelStartEvent);
    // });

    // client.on('message',function(event){ 
    //     console.log('Received message from client!',event);
    // });

    // client.on('disconnect',function(){
    //     console.log('Client has disconnected');
    // });

    client.on('create', (room) => {
        console.log(room)
        client.join(room);
    });

    client.on('button.planet.click', (id) => {
        console.log('button',id);
        client.in('vr').emit('travel.to.planet', id);
    })
});