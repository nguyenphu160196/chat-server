const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const roomSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "user"
    },
    paticipant:[{
        type: Schema.Types.ObjectId,
        ref: "user"
    }],
    createAt: {
        type: Date,
        default: Date.now
    },
    avatar: {
        type: String,
        default: ''
    }
});

module.exports = mongoose.model('room', roomSchema);