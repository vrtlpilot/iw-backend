import mongoose = require('mongoose');

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
    job: {
        company: String,
        position: String
    },
    photo: Buffer,
    avatar: Buffer,
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
