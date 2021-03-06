import mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

// Repost schema definition.
const RePost = new Schema({
    postId: {
        type: ObjectId,
        ref: 'Post'
    },
    date: {
        type: Date,
        default: Date.now
    }
});

// Compose repost object properties for UI
export function getRepostData(post, rdate) {
    return {
        postId: post._id,
        userId: post.userId._id,
        userName: post.userId.name,
        userLogin: post.userId.login,
        userAvatar: post.userId.avatar,
        date: post.date,
        edited: post.edited,
        content: post.content,
        tags: post.postId.tags,
        reposted: rdate
    }
}

export default RePost;