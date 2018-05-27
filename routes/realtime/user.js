const express = require("express");
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const User = require('../../models/user');

module.exports = (socket) => {	
    
    User.findById(socket.decoded.id, (err, user) => {
        if(err) throw err;
        if(user){
            user.socketID = socket.id;
            user.save(err => {
                if(err) throw err;
            })
        }
    })

    socket.on('disconnect', () => {
        User.findById(socket.decoded.id, (err, user) => {
            if(err) throw err;
            if(user){
                user.socketID = '';
                user.save(err => {
                    if(err) throw err;
                })
            }
        })
    })
}