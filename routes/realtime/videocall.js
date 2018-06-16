const Room = require('../../models/room');
const User = require('../../models/user');

module.exports = (socket) => {
    socket.on('signal-video-call', data => {
        socket.emit('recieve-signal-video-call',data);
        if(data.user.length != 0){            
            data.user.map((val, i) => {
                if(val != socket.decoded.id){
                    User.findById(val, (err, user) => {
                        socket.broadcast.to(user.socketID).emit('recieve-remote-signal-video-call',data);
                    })   
                }
            })
        }        
    })

    socket.on('give-away-done', data => {
        Room.findById(data, (err, room) => {
            if(err) throw err;
            if(room){
                room.paticipant.map((val, i) => {
                    User.findById(val, (err, user) => {
                        if(err) throw err;
                        if(user){
                            socket.broadcast.to(user.socketID).emit('recieve-give-away-done',data.room);
                        }
                    })
                })
            }
        })
    })

}