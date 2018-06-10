const express = require('express');
const fs = require('fs');
const router = express.Router();
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const middleware = require('../middleware');

const config = require('../../config/config');
const User = require('../../models/user');

const multer  = require('multer')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/avatars')   
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.fieldname + '.' + file.mimetype.split('/')[1])      
    }
})
const upload = multer({ storage: storage });

//get avatar
router.get('/user.avatar/:id', middleware.verifyToken, (req, res) => {
  User.findById(req.params.id, function(err, user) {
    if(err) throw err;
    if(!user){
      res.status(401).json({success: false, message: 'User not found!'});
    }else{
      let director = (__dirname).split('routes/api')[0];
      res.sendFile(director+user.avatar);  
    }
  })
})


// sign up account.
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
                  { expiresIn: 259200 });
        
                  res.status(200).json({ 
                    uccess: true, 
                    message: 'Sign up successfully',
                    token: token,
                    user: user
                  });          
                })
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
        { expiresIn: 259200 });

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
  router.put('/user.status', middleware.verifyToken, (req, res) => {
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

// change email
router.put('/user.change.email', middleware.verifyToken, (req, res) => {
  User.findById(req.userId, function(err, user){
    if(err) throw err;
    if(!user){
      return res.status(401).json({success: false, message: "User not found"});
    }else{
      User.findUserByEmail(req.body.email, (err, email) => {
        if (err) throw err;
        if(email) {
          return res.status(401).json({ success: false, message: 'The Email has already been taken.' });
        }else{
          if(req.body.email !== undefined){
            user.set({ email: req.body.email });
            user.save(err => {
              if(err) throw err;
              return res.status(200).json({
                success: true,
                message: "Email has changed to " + req.body.email,
                email: user.email
              })
            })
          }
        }
      })
    }
  })
})

//change password
router.put('/user.change.pass', middleware.verifyToken, (req, res) => {
  User.findById(req.userId, function(err, user){
    if(err) throw err;
    if(!user){
      return res.status(401).json({success: false, message: "User not found"});
    }else{
      if(req.body.newpass !== undefined){
        bcrypt.genSalt(10, function (err, satl) {
          bcrypt.hash(req.body.newpass, satl)
              .then(function (hash) {
                  user.set({ password: hash });
                  user.save(err => {
                    if(err) throw err;
                    return res.status(200).json({
                      success: true,
                      message: "Password has changed to " + req.body.newpass
                    })
                  })
              })
        });
      }
    }
  })
})

//change name
router.put('/user.change.name', middleware.verifyToken, (req, res) => {
  User.findById(req.userId, function(err, user){
    if(err) throw err;
    if(!user){
      return res.status(401).json({success: false, message: "User not found"});
    }else{
      if(req.body.name !== undefined){
        user.set({ name: req.body.name });
        user.save(err => {
          if(err) throw err;
          return res.status(200).json({
            success: true,
            message: "Name has changed to " + req.body.name,
            name: user.name
          })
        })
      }
    }
  })
})

//upload avatar
router.post('/avatar/:id', [upload.single('file'), middleware.verifyToken], function (req, res) {
  User.findOne({_id: req.params.id}, function(err, user) {
    if(err) throw err;    
      if(user.avatar.charAt(0) != '#'){
        fs.unlink(user.avatar, (err) => {
          if (err) throw err;
        });
      } 
      user.set({ avatar: req.file.path });
      user.save((err, result) => {
          if(err) throw err;
          return res.status(200).json({
            success: true,
            message: 'upload avatar success',
            avatar: user.avatar
          })
      })
    });
  })

  //check password
  router.post('/check.pass', middleware.verifyToken, function(req, res){
    User.findById(req.userId, function(err, user){
      if(err) throw err;
      if(user){
        User.comparePassword(req.body.password, user.password, (err, isMatch) => {
          if (err) throw err;
          if (isMatch) {
            return res.status(200).json({ success: false, message: 'The password is correct' });
          }else{
            return res.status(401).json({ success: false, message: 'The password is incorrect' });
          }
        })
      }
    })
  })

  //find user
  router.get('/search.user/:user', middleware.verifyToken, (req, res) => {
    User.find({name:{$regex: req.params.user}}, (err, user) => {
      if(err) throw err;
      if(!user){
        return res.json({success: true, message: 'Not found!'});
      }else{
        return res.json({success: true, user: user});
      }
    })
  })

  //get user info
  router.get('/info.user/:id', middleware.verifyToken, (req,res) => {
    User.findById(req.params.id, (err, user) => {
      if(err) throw err;
      if(!user){
        return res.json({success: true, message: 'User not found'});
      }else{
        return res.json({success: true, user: user});
      }
    })
  })

  //add black list
  router.put('/user.add.blacklist', middleware.verifyToken, (req, res) => {
    User.findById(req.userId, (err, user) => {
      if(err) throw err;
      if(user){
        user.blacklist.push(req.body.black);
        user.save(err => {
          if(err) throw err;
          return res.status(200).json({success: true, message: 'Add backlist success', user: user}) 
        })
      }
    })
  })

  //remove from black list
  router.put('/user.add.blacklist', middleware.verifyToken, (req, res) => {
    User.findById(req.userId, (err, user) => {
      if(err) throw err;
      if(user){
        user.blacklist.map((val, i) => {
          if(val == req.body.black){
            user.blacklist.splice(i,1);
            user.save(err => {
              if(err) throw err;
              return res.status(200).json({success: true, message: 'Add backlist success', user: user}) 
            })
          }
        });
      }
    })
  })

  router.get('/user.get.room', middleware.verifyToken, (req, res) => {
    User.findById(req.userId, (err, user) => {
      if(err) throw err;
      if(user){
        return res.json({success: true, room: user.room});
      }
    })
  })


  router.param('id', (req,res, next, id) => {
    User.findById(id, (err, user) => {
        if(err){
            next(err);
        }else if(user){
            next();
        }else{
            next(new Error('failed to load user'));
        }
    })
  })

module.exports = router;