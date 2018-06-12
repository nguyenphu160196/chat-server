const express = require("express");
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const Room = require('../../models/room');
const User = require('../../models/user');

module.exports = (socket) => {

    socket.on('change-room-name', data => {
        User.findById(data.id, (err, user) => {
            if(err) throw err;
            if(user){
                socket.broadcast.to(user.socketID).emit('recieve-change-room-name',data.name);
            }
        })
    })

    socket.on('add-participant', data => {
        User.findById(data.who, (err, user) => {
            if(err) throw err;
            if(user && user._id != data.user){
                socket.broadcast.to(user.socketID).emit('recieve-add-participant',{ room : data.room, user: data.user });
            }
        })
    })
    
    socket.on('kick-user', data => {
        User.findById(data.user, (err, user) => {
            if(err) throw err;
            if(user){
                Room.findById(data.room, (err, room) => {
                    socket.broadcast.to(user.socketID).emit('recieve-kick-user',{room: room, user: user.room});
                    room.paticipant.map((val, i) => {
                        if(val != room.owner){
                            User.findById(val, (err, user2) => {
                                socket.broadcast.to(user2.socketID).emit('recieve-update-kick-user',{room:room, user:data.user});
                            })
                        }
                    })
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