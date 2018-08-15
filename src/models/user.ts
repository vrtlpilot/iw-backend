import mongoose = require('mongoose');
import {Image} from './Image';
import Wallet from './Wallet';

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

// Employment schema definition.
const Employment = new Schema({
    company: {
        type: String,
        required: true
    },
    position: {
        type: String,
        required: true
    }
});

// User schema definition.
const schema = new Schema({
    name: {
        type: String, 
        required: true
    },
    pwd: {
        type: Buffer,  
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        index: {
            unique: true,
            sparse: true
        }
    },
    phone: String,
    job: Employment,
    photo: Image,
    avatar: Image,
    location: String,
    clinks: [String],
    // deals: [{
    //     type: ObjectId,
    //     ref: 'Deal'
    // }],
    pools: [{
        type: ObjectId,
        ref: 'Pool'
    }],
    wallets: [Wallet],
    follows: [{
        type: ObjectId,
        ref: 'User'
    }],
    subscribers: [{
        type: ObjectId,
        ref: 'User'
    }],
    notifications: {
        type: Boolean,
        default: false
    },
    language: {
        type: String,
        enum: ['en', 'ru', 'cn'],
        default: 'en'
    }
}, { timestamps: true });

schema.set('toJSON', {
    virtuals: true
});

export default mongoose.model('User', schema);
