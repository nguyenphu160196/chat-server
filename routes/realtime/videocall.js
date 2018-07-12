const Room = require('../../models/room');
const User = require('../../models/user');
const uuidv1 = require('uuid/v1');

let callstack = [];

module.exports = (socket) => {
    socket.on('signal-video-call', data => {   
        callstack.push(data);
        data.webrtc = uuidv1();
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
        data.from = socket.decoded.id;
        callstack.map((val, i) => {
            if(val.room == data.room && val.caller == data.caller){
                User.findById(data.caller, (err, user) => {
                    socket.broadcast.to(user.socketID).emit('recieve-accept-call', data);
                })
            }
        })
    })

    socket.on('answer-call', data => {
        User.findById(data.from, (err, user) => {
            socket.broadcast.to(user.socketID).emit('recieve-answer-call', data);            
        })
    })

    socket.on('start-audio-call', data => {
        Room.findById(data.room, (err, room) => {
            room.paticipant.map((val, i) => {
                User.findById(val, (error, user) => {
                    if(val._id != socket.decoded.id){
                        socket.broadcast.to(user.socketID).emit('recieve-start-audio-call', {id: socket.decoded.id, name: data.name, avatar: data.avatar, room: data.room});
                    }
                })
            })
        })
    })

    socket.on('end-audio-call', data => {
        console.log(data);
        Room.findById(data, (err, room) => {
            room.paticipant.map((val, i) => {
                User.findById(val, (error, user) => {
                    if(val._id != socket.decoded.id){
                        socket.broadcast.to(user.socketID).emit('recieve-end-audio-call', {id: socket.decoded.id, room: data});
                    }
                })
            })
        })
    })

}