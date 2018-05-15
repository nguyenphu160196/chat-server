const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const verifyToken = require('../verifyToken');

const config = require('../../config/config');
const User = require('../../models/user');

var multer  = require('multer')

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/avatars')   
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)      
    }
})
var upload = multer({ storage: storage });

//upload avatar
router.post('/avatar/:id', upload.single('avatar'), function (req, res, next) {
  // req.file is the `avatar` file
  // req.body will hold the text fields, if there were any
  User.findOne({id: req.params.id}, function(err, user) {
    if(err) throw err;
    if(user){
      user.avatar = Date.now() + '-' + req.file;
      user.save((err, result) => {
          if(err) throw err;
          return res.json({
            success: true,
            message: 'upload avatar success'
          })
      })
    } 
  })

})


// user sign up account.
router.post('/register', function (req, res, next) {
	
  var errors = {};
  var name = req.body.name,
  email = req.body.email,
  password = req.body.password,
  password2 = req.body.password2;
  req.checkBody('password2', 'Password does not match.').equals(req.body.password);
	errors = req.validationErrors();

	if (errors) {
    return res.status(401).json({ success: false, message: errors[0].msg });
	} else {
    
    User.findOne({email: email}, function (err, result) {
      if (err) throw err;
      if (result) {
        return res.status(401).json({ success: false, message: 'The Email has already been taken.' });
      } else {
        bcrypt.genSalt(10, function (err, satl) {
          bcrypt.hash(password, satl)
              .then(function (hash) {
                User.create({
                  name: name,
                  email: email,
                  password: hash,
                  avatar: config.colorArray[Math.floor(Math.random()*50)]
                })
                .then(function (user) {
                  let token = jwt.sign({
                    id: user._id
                  },
                  config.secret,
                  { expiresIn: 604800 });
        
                  res.status(200).json({ 
                    uccess: true, 
                    message: 'Sign up successfully',
                    token: token,
                    user: user
                  });          
                })
              })
              .catch(function () {
                  return next(err);
              })
        });
      }
    });
	}
});

// login
router.post('/login', (req, res, next) => {
	const email = req.body.email;
  const password = req.body.password;

	User.findUserByEmail(email, (err, user) => {
    if (err) throw err;
		if(!user) {
			return res.status(401).json({ success: false, message: 'The user not found' });
    }

		User.comparePassword(password, user.password, (err, isMatch) => {
			if (err) throw err;
			if (isMatch) {
				const token = jwt.sign({
          id: user._id
        },
        config.secret,
        { expiresIn: 604800 });

				return res.status(200).json({ 
          success: true,
					token: token,
					user: user
        });
			} else {
				return res.status(401).json({ success: false, message: 'The password is incorrect' });
			}
		});
	})
});

//change status
  router.post('/user.status', verifyToken, (req, res) => {
      User.findById(req.userId, function(err, user){
        if(err) throw err;
        if(!user){
          return res.status(401).json({success: false, message: "User not found"});
        }else{
          if(req.body.status !== undefined){
            user.set({ status: req.body.status });
          }
          user.save(err => {
            if(err) throw err;
            return res.status(200).json({
              success: true,
              message: "Status have changed to " + req.body.status,
              user: user
            })
          })
        }
      })
  })




module.exports = router;