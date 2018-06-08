const express = require("express");
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

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
                })
            }
        })
    })
}