const express = require('express');
const router = express.Router();
const config = require('../../config/config');

const Room = require('../../models/room');
const User = require('../../models/user');
const middleware = require('../middleware');


//create room
router.post('/create.room', middleware.verifyToken, (req, res) => {
    User.findById(req.userId, (err, user) => {
        if(err) throw err;
        if(!user){
            return res.status(401).json({success: false, message: 'User not found!'});
        }else{
            if((req.body.paticipant.length == 2) && (req.body.direct == true)){
                Room.create({
                    owner: req.userId,
                    paticipant: req.body.paticipant
                })
                .then(room => {
                    if(room.paticipant.length > 0){
                        for(let i=0; i<room.paticipant.length;i++){
                            User.findById(room.paticipant[i], (err, user2) => {
                                if(err) throw err;
                                user2.room.push(room._id);
                                user2.save(err => {
                                    if(err) throw err;
                                })
                            })
                        }
                    }
                    return res.status(200).json({success: true, message: 'Create room successfully!', room: room, user: room._id});
                })
            }else{
                Room.create({
                    name: req.body.name,
                    owner: req.userId,
                    paticipant: req.body.paticipant,
                    avatar: config.colorArray[Math.floor(Math.random()*50)],
                    direct: req.body.direct
                })
                .then(room => {
                    if(room.paticipant.length > 0){
                        for(let i=0; i<room.paticipant.length;i++){
                            User.findById(room.paticipant[i], (err, user2) => {
                                if(err) throw err;
                                user2.room.push(room._id);
                                user2.save(err => {
                                    if(err) throw err;
                                })
                            })
                        }
                    }
                    return res.status(200).json({success: true, message: 'Create room successfully!', room: room, user: room._id});
                })
            }
        }
    })
})

//add participant
router.put('/add.user.room/:id', middleware.verifyToken, (req, res) => {
    User.findById(req.userId, (err, user) => {
        if(err) throw err;
        if(!user){
            return res.status(401).json({success: false, message: 'User not found'});
        }else{
            Room.findById(req.params.id, (err, room) => {
                if(err) throw err;
                if(!room){
                    return res.status(401).json({success: false, message: 'Room not found'});
                }else{
                    room.paticipant.push(req.body.user);
                    room.save(err => {
                        if(err) throw err;
                        return res.status(200).json({success: true, message: 'Add user successfully', participant: room.paticipant})
                    })
                    User.findById(req.body.user ,(err, user2) => {
                        if(err) throw err;
                        user2.room.push(room._id);
                        user2.save(err => {
                            if(err) throw err;
                        })
                    })
                }
            })

        }
    })
})

function removeA(arr) {
    var what, a = arguments, L = a.length, ax;
    while (L > 1 && arr.length) {
        what = a[--L];
        while ((ax= arr.indexOf(what)) !== -1) {
            arr.splice(ax, 1);
        }
    }
    return arr;
}

//kick user
router.put('/kick.user/:id', middleware.verifyToken, (req, res) => {
    User.findById(req.userId, (err, user) => {
        if(err) throw err;
        if(!user){
            return res.status(401).json({success: false, message: 'User not found'});
        }else{
            Room.findById(req.params.id, (err, room) => {
                if(err) throw err;
                if(!room){
                    return res.status(401).json({success: false, message: 'Room not found'});
                }else{
                    if(req.userId == room.owner){
                        removeA(room.paticipant,req.body.user);
                        room.save(err => {
                            if(err) throw err;
                            return res.status(200).json({success: true, message: 'Kick user successfully!', participant: room.paticipant});
                        })
                        User.findById(req.body.user, (err, user2) => {
                            if(err) throw err;
                            removeA(user2.room,room._id);  
                            user2.save(err => {
                                if(err) throw err;
                            })
                        })
                        
                    }else{
                        return res.status(401).json({success: false, message: 'Request denied!'});
                    }
                }
            })

        }
    })
})

//remove room
router.delete('/remove.room/:id', middleware.verifyToken, (req, res) => {
    User.findById(req.userId, (err, user) => {
        if(err) throw err;
        if(!user){
            return res.status(401).json({success: false, message: 'User not found!'});
        }else{
            Room.findById(req.params.id, (err, room) => {
                if(err) throw err;
                if(!room){
                    return res.status(401).json({success: false, message: 'Room not found!'});
                }else{
                    for(let i=0; i<room.paticipant.length; i++){
                        User.findById(room.paticipant[i], (err, user2) => {
                            removeA(user2.room,room._id);
                            user2.save(err => {
                                if(err) throw err;
                            })
                        })
                    }
                    Room.remove({_id: req.params.id}, (err) => {
                        if(err) throw err;
                        return res.status(200).json({success: true, message: 'Room have been remove!', user: room._id});
                    });
                }
            })
        }
    })
})

//leave room
// router.put('/leave.room/:id', middleware.verifyToken, (req, res) => {
//     User.findById(req.userId, (err, user) => {
//         if(err) throw err;
//         if(!user){
//             return res.status(401).json({success: false, message: 'User not found'});
//         }else{
//             Room.findById(req.params.id, (err, room) => {
//                 if(err) throw err;
//                 if(!room){
//                     return res.status(401).json({success: false, message: 'Room not found'});
//                 }else{
//                     removeA(room.paticipant,req.userId);
//                     removeA(user.room, room._id);
//                     room.save(err => {
//                         if(err) throw err;
//                     })
//                     user.save(err => {
//                         if(err) throw err;
//                         return res.status(200).json({success: true, message: 'Leave room successfully!', room:user.room})
//                     })

//                 }
//             })

//         }
//     })
// })

//get room info
router.get('/info.room/:id', middleware.verifyToken, (req, res) => {
    User.findById(req.userId, (err, user) => {
        if(err) throw err;
        if(!user){
            return res.status(401).json({success: false, message: 'User not found'});
        }else{
            Room.findById(req.params.id, (err, room) => {
                if(err) throw err;
                if(!room){
                    return res.status(401).json({success: false, message: 'Room not found!'});
                }else{
                    if(room.paticipant.indexOf(req.userId) < 0){
                        return res.status(401).json({success: false, message: 'You do not have permission!'});
                    }else{
                        return res.status(200).json({success: true, message: 'Get room info', room: room});
                    }  
                    // return res.status(200).json({success: true, message: 'Get room info', room: room});
                }
            })
        }
    })
})

//change room name
router.put('/room.change.name/:id', middleware.verifyToken, (req, res) => {
    User.findById(req.userId, (err, user) => {
        if(err) throw err;
        if(!user){
            return res.status(401).json({success: false, message: 'User not found'});
        }else{
            Room.findById(req.params.id, (err, room) => {
                if(err) throw err;
                if(!room){
                    return res.status(401).json({success: false, message: 'Room not found!'});
                }else{
                    if(req.body.name !== undefined){
                        room.name = req.body.name;
                    }
                    room.save(err => {
                        if(err) throw err;
                        return res.status(200).json({success: true, message: 'Change name successfully'});
                    })
                }
            })
        }
    })
})

//unlock room
router.put('/room.unlock', middleware.verifyToken, (req, res) => {
    User.findById(req.userId, (err, user) => {
        if(err) throw err;
        if(user){
            user.blacklist.splice(user.blacklist.indexOf(req.body.room),1);
            user.room.push(req.body.room);
            user.save(err => {
                if(err) throw err;
                return res.json({success: true, room: user.room});
            })
        }
    })
})


//hide room
router.put('/room.hide', middleware.verifyToken, (req, res) => {
    User.findById(req.userId, (err, user) => {
        if(err) throw err;
        if(user){
                user.room.splice(user.room.indexOf(req.body.room),1);
                user.blacklist.push(req.body.room);
                user.save(err => {
                    if(err) throw err;
                    return res.json({success: true, room: user.room});
                })
        }
    })
})

router.param('id', (req, res, next, id) => {
    Room.findById(id, (err, room) => {
        if(err){
            next(err);
        }else if(room){
            next();
        }else{
            next(new Error('failed to load room'));
        }
    })
  })

module.exports = router;