const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = new Schema({
    roomId: {
        type: Schema.Types.ObjectId,
        ref: "room"
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "user"
    },
    text: String,
    seen: [{
        type: Schema.Types.ObjectId,
        ref: "user"
    }],
    createAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('message', messageSchema);