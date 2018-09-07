import mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

// Comment schema definition.
const schema = new Schema({
    userId: {
        type: ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    content: String,
});

// Compose comment object properties for UI
export function getCommentData(item) {
    return {
        Id: item._id,
        userId: item.userId._id,
        userName: item.userId.name,
        userLogin: item.userId.login,
        date: item.date,
        content: item.content,
    }
}

export default mongoose.model('Comment', schema);   