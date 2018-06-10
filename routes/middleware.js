const jwt = require('jsonwebtoken');
const config = require('../config/config');
const Room = require('../models/room')

exports.verifyToken = function (req, res, next) {
    var token = req.headers['x-access-token'];
    if (!token){
        return res.status(403).json({ auth: false, message: 'Use must loggin to use this function' });
    }else{
        jwt.verify(token, config.secret, function(err, decoded) {
            if (err){
                return res.status(500).json({ auth: false, message: 'Failed to authenticate token.' });
            }else{
                req.userId = decoded.id;
                next();
            }
        });
    }
}

