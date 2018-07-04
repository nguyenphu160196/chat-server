const Room = require('../../models/room');
const User = require('../../models/user');

let callstack = [];

module.exports = (socket) => {
    socket.on('signal-video-call', data => {   
        callstack.push(data);
        Room.findById(data.room, (err, room) => {
            if(err) throw err;
            if(room.paticipant.length != 0){
                room.paticipant.map((val, i) => {
                    if(val != socket.decoded.id){
                        User.findById(val, (error, user) => {
                            socket.broadcast.to(user.socketID).emit('recieve-signal-video-call',data);
                        })
                    }
                })
            }
        })
    })

    socket.on('end-call', data => {
        if(callstack.length != 0){
            callstack.map((val, i) => {
                if(val.caller == socket.decoded.id){
                    Room.findById(val.room, (err, room) => {
                        if(err) throw err;
                        if(room.paticipant.length != 0){
                            room.paticipant.map((val, i) => {
                                if(val != socket.decoded.id){
                                    User.findById(val, (error, user) => {
                                        socket.broadcast.to(user.socketID).emit('recieve-end-call',false);
                                    })
                                }
                            })
                        }
                    })
                    callstack.splice(i, 1);
                }
            })
        }
    })

    socket.on('decline-call', data => {
        callstack.map((val, i) => {
            if(val.room == data.room && val.caller == data.caller){
                User.findById(data.caller, (err, user) => {
                    socket.broadcast.to(user.socketID).emit('recieve-decline-call',socket.decoded.id);
                })
            }
        })
    })  

    socket.on('reject-call-busy', data => {
        User.findById(data, (err, user) => {
            socket.broadcast.to(user.socketID).emit('recieve-reject-call-busy', socket.decoded.id + " is busy");
        })
    })

    socket.on('clear-call-stack', data => {
        if(callstack.length != 0){
            callstack.map((val, i) => {
                if(val.caller == socket.decoded.id){
                    callstack.splice(i, 1);
                }
            })
        }
    })

    socket.on('accept-call', data => {
        callstack.map((val, i) => {
            if(val.room == data.room && val.caller == data.caller){
                User.findById(data.caller, (err, user) => {
                    socket.broadcast.to(user.socketID).emit('recieve-accept-call',socket.decoded.id);
                })
            }
        })
    })

    socket.on('connect-to-anothers', data => {
        console.log('connect-to-anothers:'+data);
        if(data.members.length != 0){
            data.members.map((val, i) => {
                User.findById(val, (err, user) => {
                    socket.broadcast.to(user.socketID).emit('recieve-connect-to-anothers', data);
                })
            })
        }
    })

    socket.on('transfer-to-next', data => {
        console.log('transfer-to-next:'+data)
        if(data.length != 0){
            data.members.map((val, i) => {
                User.findById(val, (err, user) => {
                    if(err) throw err;
                    socket.broadcast.to(user.socketID).emit('recieve-connect-to-anothers', data);
                })
            })
        }
    })

    socket.on('update-callstack', data => {
        console.log('update-callstack:'+data);
        User.findById(data.caller, (err, user) => {
            socket.broadcast.to(user.socketID).emit('recieve-update-callstack', data);
        })
    })
}