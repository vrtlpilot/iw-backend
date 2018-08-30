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
    country: String,
    city: String,
    education: String,
    clinks: {
        fb: {
            type: String,
            default: ""
        },
        linkedin: {
            type: String,
            default: ""
        },
        insta: {
            type: String,
            default: ""
        },
        twitter: {
            type: String,
            default: ""
        },
        telegram: {
            type: String,
            default: ""
        },
        wechat: {
            type: String,
            default: ""
        }
    },
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

// Compose user object properties for UI
export function getUserData(user) {
    return {
        id: user._id,
        name: user.name, 
        email: user.email,
        phone: user.phone,
        job: user.job,
        photo: user.photo,
        avatar: user.avatar,
        location: user.location,
        clinks: user.clinks,
        pools: user.pools,
        wallets: user.wallets,
        follows: user.follows,
        subscribers: user.subscribers,
        notifications: user.notifications,
        language: user.language
    }
}

export default mongoose.model('User', schema);
