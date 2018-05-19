const express = require('express');
const fs = require('fs');
const router = express.Router();
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const verifyToken = require('../verifyToken');

const config = require('../../config/config');
const User = require('../../models/user');


//upload avatar
var multer  = require('multer')
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/avatars')   
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.fieldname + '.' + file.mimetype.split('/')[1])      
    }
})
var upload = multer({ storage: storage });
router.post('/avatar/:id', upload.single('file'), function (req, res, next) {
  User.findOne({_id: req.params.id}, function(err, user) {
    if(err) throw err;
    if(user.avatar.charAt(0) != '#'){
      fs.unlink(user.avatar, (err) => {
        if (err) throw err;
        user.set({ avatar: req.file.path });
        user.save((err, result) => {
            if(err) throw err;
            return res.status(200).json({
              success: true,
              message: 'upload avatar success',
              user: user
            })
        })
      });
    } else {
      user.set({ avatar: req.file.path });
      user.save((err, result) => {
          if(err) throw err;
          return res.status(200).json({
            success: true,
            message: 'upload avatar success',
            user: user
          })
      })
    }

  })

})


//get avatar
router.get('/avatar', verifyToken, (req, res) => {
  User.findOne({_id: req.userId}, function(err, user) {
    if(err) throw err;
    if(!user){
      res.status(401).json({success: false, message: 'User not found!'});
    }else{
      let director = (__dirname).split('routes/api')[0];
      res.sendFile(director+user.avatar);  
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
              .catch(function (err) {
                  console.log(err);
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

// update email
router.post('/change.email', verifyToken, (req, res) => {
  User.findById(req.userId, function(err, user){
    if(err) throw err;
    if(!user){
      return res.status(401).json({success: false, message: "User not found"});
    }else{
      User.comparePassword(req.body.password, user.password, (err, isMatch) => {
        if (err) throw err;
        if (isMatch) {
          if(req.body.email !== undefined){
            user.set({ email: req.body.email });
            user.save(err => {
              if(err) throw err;
              return res.status(200).json({
                success: true,
                message: "Email has changed to " + req.body.email,
                user: user
              })
            })
          }
        } else {
          return res.status(401).json({ success: false, message: 'The password is incorrect' });
        }
      });
    }
  })
})

//change password
router.post('/change.pass', verifyToken, (req, res) => {
  User.findById(req.userId, function(err, user){
    if(err) throw err;
    if(!user){
      return res.status(401).json({success: false, message: "User not found"});
    }else{
      User.comparePassword(req.body.oldpass, user.password, (err, isMatch) => {
        if (err) throw err;
        if (isMatch) {
          if(req.body.newpass !== undefined){
            bcrypt.genSalt(10, function (err, satl) {
              bcrypt.hash(req.body.newpass, satl)
                  .then(function (hash) {
                      user.set({ password: hash });
                      user.save(err => {
                        if(err) throw err;
                        return res.status(200).json({
                          success: true,
                          message: "Password has changed to " + req.body.newpass,
                          user: user
                        })
                      })
                  })
                  .catch(function (err) {
                    console.log(err);
                  })
            });
          }
        } else {
          return res.status(401).json({ success: false, message: 'The password is incorrect' });
        }
      });
    }
  })
})

//change name
router.post('/change.name', verifyToken, (req, res) => {
  User.findById(req.userId, function(err, user){
    if(err) throw err;
    if(!user){
      return res.status(401).json({success: false, message: "User not found"});
    }else{
      User.comparePassword(req.body.password, user.password, (err, isMatch) => {
        if (err) throw err;
        if (isMatch) {
          if(req.body.name !== undefined){
            user.set({ name: req.body.name });
            user.save(err => {
              if(err) throw err;
              return res.status(200).json({
                success: true,
                message: "Name has changed to " + req.body.name,
                user: user
              })
            })
          }
        } else {
          return res.status(401).json({ success: false, message: 'The password is incorrect' });
        }
      });
    }
  })
})

module.exports = router;