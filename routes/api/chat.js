const express = require('express');
const router = express.Router();

const middleware = require('../middleware');

const Room = require('../../models/room');
const User = require('../../models/user');
const Message = require('../../models/message');


router.get('/message.get/:id', middleware.verifyToken, (req, res) => {
    let page = req.headers['message-page'];
    Message.paginate({roomId: req.params.id}, { page: page, limit: 20, sort:{ 'createAt': -1 }})
    .then(message => {
        return res.json({message : message});
    })
});


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
