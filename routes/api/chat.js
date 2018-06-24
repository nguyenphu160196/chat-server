const express = require('express');
const router = express.Router();
const multer  = require('multer');
let Promise = require('promise');

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

  router.get('/downloadFile/:file', (req, res) => {
    let director = (__dirname).split('routes/api')[0] + 'public/file/';
    res.download(director + req.params.file, req.params.file.split("-attach-")[0], function(err){
      if (err) {
        console.log(err);
      } else {
        // decrement a download credit, etc.
        console.log(req.params.file.split("-attach-")[0]);
      }
    });
  })

    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'public/file')   
        },
        filename: function (req, file, cb) {
            cb(null, file.originalname + '-' + file.fieldname + '-' + Date.now())      
        }
    })
    const attach = multer({ storage: storage }).array('attach');

    router.post('/message.attach', middleware.verifyToken, (req, res) => {
        attach(req, res, function (err) {
          if (err) throw err;
          let array = [];
          req.files.map((val, i) => {
            array.push(val.path);
          })  
          return res.json({file: array});
        })
      })


module.exports = router;
