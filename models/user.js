var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    avatar: String,
    invite: [{
        fromUser: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
        },
        creatAt: {
            type: Date,
            default: Date.now
        },
        seen: {
            type: Boolean,
            default: false
        }
    }],
    friends: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }],
    notifications:[{
        content: String,
        createAt: String,
        seen: {
            type: Boolean,
            default: false
        }
    }]    
});

userSchema.statics.comparePassword = function (candidatePassword, hashPassword, callback) {
	bcrypt.compare(candidatePassword, hashPassword, (err, isMatch) => {
		if (err) throw err;

		callback(null, isMatch);
	})
};

userSchema.statics.findUserByEmail = function (email, callback) {
	User.findOne({email}, callback);
}

userSchema.pre('save', function (next) {
    var user = this;
    bcrypt.genSalt(10, function (err, satl) {
        bcrypt.hash(user.password, satl)
            .then(function (hash) {
                user.password = hash;
                next();
            })
            .catch(function () {
                return next(err);
            })
    });
});

var User = mongoose.model('user', userSchema);
module.exports = User;