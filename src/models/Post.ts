import mongoose = require('mongoose');
import {Image} from './Image';

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

// Post schema definition.
const schema = new Schema({
    user_id: {
        type: ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    date:{ 
        type: Date,
        default: Date.now
    },
    content: String,
    tags: [String],
    images: [Image]
});

export default mongoose.model('Post', schema);   