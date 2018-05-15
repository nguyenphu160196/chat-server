const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const roomSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    members:[{
        type: Schema.Types.ObjectId,
        ref: "user"
    }],
    createAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('room', roomSchema);