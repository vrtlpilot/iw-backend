import mongoose = require('mongoose');
import { Image } from './Image';

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

// Post schema definition.
const schema = new Schema({
    userId: {
        type: ObjectId,
        ref: 'User',
        required: true
    },
     /* title: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    }, */
    date: {
        type: Date,
        default: Date.now
    },
    content: String,
    tags: [String],
    /* images: [Image] */
});

// Compose post object properties for UI
export function getPostData(post) {
    return {
        postId: post._id,
        userId: post.userId._id,
        userName: post.userId.name,
        userLogin: post.userId.login,
        date: post.date,
        content: post.content,
        tags: post.tags
    }
}

// Compose post object properties needed for response on edit post request
export function getPostDataForEditResponse(post) {
    return {
        postId: post._id,
        userId: post.userId._id,
        date: post.date,
        content: post.content,
        tags: post.tags
    }
}

export default mongoose.model('Post', schema);   