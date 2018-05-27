var mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

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
    avatar: {
        type: String,
        default: ''
    },
    status: {
        type: Boolean,
        default: true
    },
    socketID: {
        type: String,
        default: ''
    },
    room: [{
        type: Schema.Types.ObjectId,
        ref: "room"
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

// userSchema.pre('save', function (next) {
//     var user = this;
//     bcrypt.genSalt(10, function (err, satl) {
//         bcrypt.hash(user.password, satl)
//             .then(function (hash) {
//                 user.password = hash;
//                 next();
//             })
//             .catch(function () {
//                 return next(err);
//             })
//     });
// });

var User = mongoose.model('user', userSchema);
module.exports = User;