import mongoose = require('mongoose');
import Image from './Image';
import Employment from './Employment';

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const schema = new Schema({
    name: {
        type: String,
        required: true
    },
    pwd: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
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
    deals: [ObjectId],
    pools: [ObjectId],
    wallets: [String]
}, { timestamps: true });

schema.set('toJSON', {
    virtuals: true
});

export default mongoose.model('User', schema);
