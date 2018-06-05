const express = require("express");
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const User = require('../../models/user');
const Message = require('../../models/message');

module.exports = (socket) => {
    socket.on('client-send-message', data => {
        let recieve = data.recieve;
        let newMessage = new Message({
            roomId: data.room,
            user: socket.decoded.id,
            text: data.message,
        })
        let array = [];
        newMessage.save()
        .then(() => {
            socket.emit("recieve-message", newMessage);
            recieve.map((val, i) => {
            User.findById(val, (err, user) => {
                if(err) throw err;
                if(user && (user.socketID != '')){
                    socket.broadcast.to(user.socketID).emit("recieve-message", newMessage);
                    console.log(user.socketID);
                }
            })
        })
        })
        .catch(err => {
            socket.emit("recieve-message", {errors: err});
        });

    })
}