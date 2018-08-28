import mongoose = require('mongoose');
import Wallet from './Wallet';

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

// Pool member definition.
const Member = new Schema({
    user_id: {
        type: ObjectId,
        ref: 'User'
    },
    summ: Number
});

// Pool schema definition.
const schema = new Schema({
    holderOfPool: {
        type: ObjectId,
        ref: 'User'
    },
    name: String,
    poolName: String,
    verifyContractLink: String,
    /* description: String, */
    projectLink: String,
    wallet: Wallet,
    sum_min: Number,
    sum_max: Number,
    sum_mbr_min:Number,
    sum_mbr_max:Number,
    endDate: Date,
    addressForComissionPayment: String,
    comission: Number,
    lead_comission: Number,
    members: [Member]
}, { timestamps: true });

export default mongoose.model('Pool', schema);   