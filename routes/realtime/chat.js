const User = require('../../models/user');
const Message = require('../../models/message');
const Room = require('../../models/room');

module.exports = (socket) => {
    socket.on('client-send-message', data => {
        let recieve = data.recieve;
        let room = data.room;
        let newMessage = new Message({
            roomId: room,
            user: socket.decoded.id,
            text: data.message,
            seen: recieve
        });
        Room.findById(room, (err, room) => {
            if(err) throw err;
            if(room){
                room.last = data.message;
                room.save(err => {
                    if(err) throw err;
                })
            }
        })
        newMessage.save()
        .then(message => {
            recieve.map((val, i) => {
                User.findById(val, (err, user) => {
                    if(err) throw err;
                    if(user){
                        socket.broadcast.to(user.socketID).emit("recieve-message", { room: room, message : newMessage, last: data.message});
                    }
                })
            })
        })
        .catch(err => {
            socket.emit("recieve-message", {errors: err});
        });

    })
    socket.on('typing', data => {
        data.party.map((val, i) => {
            if(val != data.user){
                User.findById(val, (err, user) => {
                    if(err) throw err;
                    if(user){
                        socket.broadcast.to(user.socketID).emit("recieve-typing", {room: data.room, user: data.user});
                    }
                })
            }
        })
    })
    socket.on('un-typing', data => {
        data.party.map((val, i) => {
            if(val != data.user){
                User.findById(val, (err, user) => {
                    if(err) throw err;
                    if(user){
                        socket.broadcast.to(user.socketID).emit("recieve-untyping", {room: data.room, user: data.user});
                    }
                })
            }
        })
    })
}