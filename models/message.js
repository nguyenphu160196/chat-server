const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
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
    file: [],
    seen: [{
        type: Schema.Types.ObjectId,
        ref: "user"
    }],
    createAt: {
        type: Date,
        default: Date.now
    }
});

messageSchema.plugin(mongoosePaginate);
const message = mongoose.model('message', messageSchema);

module.exports = message;