const express = require("express");
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const User = require('../../models/user');
const Message = require('../../models/message');

module.exports = (socket) => {
    socket.on('client-send-message', data => {
        let recieve = data.recieve;
        let room = data.room;
        let newMessage = new Message({
            roomId: room,
            user: socket.decoded.id,
            text: data.message,
            seen: recieve
        })
        let array = [];
        newMessage.save()
        .then(message => {
            socket.emit("recieve-message", newMessage);
            recieve.map((val, i) => {
                User.findById(val, (err, user) => {
                    if(err) throw err;
                    if(user){
                        socket.broadcast.to(user.socketID).emit("recieve-message", { room: room, message : newMessage});
                    }
                })
            })
        })
        .catch(err => {
            socket.emit("recieve-message", {errors: err});
        });

    })
}