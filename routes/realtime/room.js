const express = require("express");
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const Room = require('../../models/room');
const User = require('../../models/user');

module.exports = (socket) => {	
    
    socket.on('update-direct-room', data => {
        User.findById(data, (err, user) => {
            if(err) throw err;
            if(user){
                socket.broadcast.to(user.socketID).emit('recieve-update-direct-room',user.room);
            }
        })
    });

    socket.on('disconnect', () => {

    })
}