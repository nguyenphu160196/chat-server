const express = require("express");
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const Room = require('../../models/room');

module.exports = (socket) => {	
    
    socket.on('disconnect', () => {

    })
}