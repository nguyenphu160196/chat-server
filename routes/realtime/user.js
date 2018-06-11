const express = require("express");
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const Room = require('../../models/room');
const User = require('../../models/user');

module.exports = (socket) => {	

    //update socketid for client
    socket.emit("update-socketid", socket.id);

    //update satus for user when they connecting
    socket.on("user-online", data => {
        User.findById(socket.decoded.id, (err, user) => {
            if(err) throw err;
            if(user){
                user.status = data;
                user.save(err => {
                    if(err) throw err;
                    user.room.map((val, i) => {
                        Room.findById(val, (err, room) => {
                            if(err) throw err;
                            room.paticipant.map((value, j) => {
                                if(user._id != value){
                                    User.findById(value, (err, user2) => {
                                        socket.broadcast.to(user2.socketID).emit('recieve-user-status-on',{room: room._id, user : socket.decoded.id});
                                    })
                                }
                            })
                        })
                    })
                })
            }
        })
    })
    
    //save new socketid
    User.findById(socket.decoded.id, (err, user) => {
        if(err) throw err;
        if(user){
            user.socketID = socket.id;
            user.save(err => {
                if(err) throw err;
            })
        }
    })

    //remove socketid
    socket.on('disconnect', () => {
        User.findById(socket.decoded.id, (err, user) => {
            if(err) throw err;
            if(user){
                user.socketID = '';
                user.status = false;
                user.save(err => {
                    if(err) throw err;
                    user.room.map((val, i) => {
                        Room.findById(val, (err, room) => {
                            if(err) throw err;
                            room.paticipant.map((value, j) => {
                                if(user._id != value){
                                    User.findById(value, (err, user2) => {
                                        socket.broadcast.to(user2.socketID).emit('recieve-user-status-off',{room: room._id, user : socket.decoded.id});
                                    })
                                }
                            })
                        })
                    })
                })
            }
        })
    })
}