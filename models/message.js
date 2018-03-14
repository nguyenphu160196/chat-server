const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = new Schema({
    from:[{
        type: Schema.Types.ObjectId,
        ref: "user"
    }],
    participant: [{
        type: Schema.Types.ObjectId,
		ref: 'user'
    }],
    text: String,
    createAt: String
});

module.exports = mongoose.model('message', messageSchema);