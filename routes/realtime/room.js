const Room = require('../../models/room');
const User = require('../../models/user');

module.exports = (socket) => {

    socket.on('change-room-name', data => {
        User.findById(data.user, (err, user) => {
            if(err) throw err;
            if(user){
                socket.broadcast.to(user.socketID).emit('recieve-change-room-name',{room: data.room, name: data.name});
            }
        })
    })

    socket.on('add-participant', data => {
        Room.findById(data.room, (err, room) => {
            if(err) throw err;
            if(room){
                room.paticipant.map((val, i) => {
                    if(val != data.user){
                        User.findById(val, (err, user2) => {
                            socket.broadcast.to(user2.socketID).emit('recieve-add-participant',{ room : data.room, user: data.user });
                        })
                    }
                })
            }
        })
    })
    
    socket.on('kick-user', data => {
        User.findById(data.user, (err, user) => {
            if(err) throw err;
            if(user){
                Room.findById(data.room, (err, room) => {
                    socket.broadcast.to(user.socketID).emit('recieve-kick-user',room);
                    room.paticipant.map((val, i) => {
                        if(val != room.owner){
                            User.findById(val, (err, user2) => {
                                socket.broadcast.to(user2.socketID).emit('recieve-update-kick-user',{room: data.room, user:data.user});
                            })
                        }
                    })
                })
            }
        })
    })
    //when create direct
    socket.on('update-direct-room', data => {
        User.findById(data.user, (err, user) => {
            if(err) throw err;
            if(user){
                socket.broadcast.to(user.socketID).emit('recieve-update-direct-room',data.room);
            }
        })
    });

    //when create room
    socket.on('update-room', data => {
        data.user.map((val, i) => {
            User.findById(val, (err, user) => {
                if(err) throw err;
                if(user){
                    socket.broadcast.to(user.socketID).emit('recieve-update-room',data.room);
                }
            })
        })
    })

    socket.on('disconnect', () => {

    })
}