const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const config = require('../../config/database');
const User = require('../../models/user');

// user sign up account.
router.post('/register', function (req, res, next) {
	// console.log(req.body);
    var errors = {};
    var name = req.body.name,
    email = req.body.email,
    password = req.body.password,
    password2 = req.body.password2;

    req.checkBody('name', 'Name field is required.').notEmpty();
    req.checkBody('email', 'Email field is required.').notEmpty();
    req.checkBody('email', 'Email not valid').isEmail();
    req.checkBody('password', 'Password field is required.').notEmpty();
    req.checkBody('password2', 'Confirm password field is required.').notEmpty();
    req.checkBody('password2', 'Password does not match.').equals(req.body.password);
	errors = req.validationErrors();

	if (errors) {
		res.json({ success: false, errors: errors });
        // console.log("error");
	} else {
    User.findOne({email: email}, function (err, result) {
      if (err) throw err;
      if (result) {
        return res.json({
          success: false,
          message: 'The Email has already been taken.',
          name: name,
          email: email
        });
      } else {
        User.create({
          name: name,
          email: email,
          password: password
        })
        .then(function (user) {
          let token = jwt.sign({
            _id: user._id,
            name: user.name
          },
          config.secret,
          { expiresIn: 604800 });

          return res.json({success: true, message: 'Sign up successfully', token: 'JWT '+token});
        })
        .catch(function (err) {
          return next(err);
        })
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
			res.json({
				success: false,
				message: 'User not found'
			});
			return;
		}

		User.comparePassword(password, user.password, (err, isMatch) => {
			if (err) throw err;
			if (isMatch) {
				const token = jwt.sign({
          _id: user._id,
          email: user.email,
          name: user.name
        },
        config.secret,
        { expiresIn: 604800 });

				res.json({
					success: true,
					token: 'JWT '+token,
					user: {
						id: user._id,
						name: user.name,
						email: user.email
					}
				});
				return;
			} else {
				res.json({
					success: false,
					message: 'Wrong password'
				});
				return;
			}
		});
	})
});

// search for friend

router.post('/search-friend', (req, res, next) =>{
User.find({email: {$regex:""+req.body.email}}, function(err, user){
    if (err) throw err;
    if (user){
        res.json({
          success: true,
          message: 'Find user success!',
          list: user
        });
    } else {
      res.json({
        success: false,
        message: 'Find user failed!'
      });
      return;
    }
  })  
})

// invite friend
router.post('/invite/:id', (req, res) => {
  User.findById(req.params.id, (err, user) => {
    if (err) throw err;
    if(user){
        user.invite.push({
          fromUser: req.body.fromUser
        });
        user.save((err, data) => {
          if(err) throw err;
          res.json({
            success: true,
            message: "Invite user success from",
            data: data
          })
        })
    }else{
      res.json({
        success: false,
        message: 'Find user failed!'
      });
      return;
    }
  })
})

//remove invite toUser
router.post('/delete-invite/:id', (req, res) => {
  User.findById(req.params.id, (err, user) => {
      if(err) throw err;
      if(user){
        var array = user.invite;
        for(var i=0; i<array.length ;i++){
          if(array[i].fromUser == req.body.fromUser){
            user.invite.splice(i,1);
          }
        }
        user.save((err, data) => {
          if (err) throw err;
          res.json({
            success: true,
            message: "delete invite success",
            data: data
          });
        })
      }else{
        res.json({
          success: false,
          message: 'User undefine!'
        });
        return;
      }
  })
})

//accept invite
router.post('/accept-invite/:id', (req, res) => {

  User.findById(req.body.fromUser, (err, user) => {
    if(err) throw err;
    if(user){
      var array = user.invite;
      for(var i=0; i<array.length ;i++){
        if(array[i].fromUser == req.params.id){
          user.invite.splice(i,1);
        }
      }
      user.friends.push(req.params.id);
      user.save(err => {
        if (err) throw err;

        User.findById(req.params.id, (err, user2) => {
          if(err) throw err;
          if(user2){
            user2.friends.push(req.body.fromUser);
            user2.save(err => {
              if (err) throw err;
              res.json({
                success: true,
                message: "accept invite",
                own: user,
                user2: user2
              })
            })
          }else{
            res.json({
              success: false,
              message: 'User undefine!'
            });
            return;
          }
        })

      })
    }else{
      res.json({
        success: false,
        message: 'OwnUser undefine!'
      });
      return;
    }
  })

})

//delete friend
router.post('/delete-friend/:id', (req, res) => {
  User.findById(req.params.id, (err, user) => {
    if (err) throw err;
    if(user){
      var array = user.friends;
      for(var i=0; i<array.length;i++){
        if(array[i] == req.body.fromUser){
          user.friends.splice(i,1);
        }
      }
      user.save(err => {
        if(err) throw err;

        User.findById(req.body.fromUser, (err, user2) => {
          if (err) throw err;
          if(user2) {
            var array2 = user2.friends;
            for(var i=0; i<array2.length;i++){
              if(array2[i] == req.params.id){
                user2.friends.splice(i,1);
              }
            }
            user2.save(err => {
              if (err) throw err;
              res.json({
                success: true,
                message: 'delete ' + req.params.id + ' friend success!'
              })
            })
          }          
        })
      })
    }else{
      res.json({
        success: false,
        message: 'OwnUser undefine!'
      });
      return;
    }
  })
})

//get friends list
router.post('/friend-list/:id', (req, res) => {
  User.findById(req.params.id, (err, data) => {
    if(err) throw err;
    if(data){
      res.json({
        success: true,
        message: "Get friend list success!",
        list: data.friends
      });
    }else {
      res.json({
        success: false,
        message: 'Find user failed!'
      });
      return;
    }
  })
})

module.exports = router;