const express = require("express");
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const Room = require('../../models/room');
const User = require('../../models/user');

module.exports = (socket) => {
    socket.on('kick-user', data => {
        User.findById(data.user, (err, user) => {
            if(err) throw err;
            if(user){
                Room.findById(data.room, (err, room) => {
                    socket.broadcast.to(user.socketID).emit('recieve-kick-user',{room: room, user: user.room});
                })
            }
        })
    })
    //when create direct
    socket.on('update-direct-room', data => {
        User.findById(data, (err, user) => {
            if(err) throw err;
            if(user){
                socket.broadcast.to(user.socketID).emit('recieve-update-direct-room',user.room);
            }
        })
    });

    //when create room
    socket.on('update-room', data => {
        data.map((val, i) => {
            User.findById(val, (err, user) => {
                if(err) throw err;
                if(user){
                    socket.broadcast.to(user.socketID).emit('recieve-update-room',user.room);
                }
            })
        })
    })

    socket.on('disconnect', () => {

    })
}