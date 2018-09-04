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
    owner: {
        type: ObjectId,
        ref: 'User'
    },
    name: String,
    poolName: String,
    status: {
        type: Number,
        default: 0
    },
    /* description: String, */
    projectLink: String,
    wallet: Wallet,
    sum_min: Number,
    sum_max: Number,
    sum_mbr_min: Number,
    sum_mbr_max: Number,
    endDate: Date,
    comissionPaymentAddress: String,
    comission: Number,
    lead_comission: Number,
    members: [Member]
}, { timestamps: true });

// transform object's properties for db
export function formatPoolData(input) {
    const {
        poolName,
        owner,
        projectName,
        projectLink,
        projectAdress,
        poolSoftCap,
        poolHardCap,
        minDeposit,
        maxDeposit,
        endDate,
        comissionOfHolder,
        comissionPaymentAddress,
        comissionOfIcoWorld
    } = input;

    return {
        poolName,
        owner,
        name: projectName,
        projectLink,
        wallet: {
            address: projectAdress
        },
        sum_min: poolSoftCap,
        sum_max: poolHardCap,
        sum_mbr_min: minDeposit,
        sum_mbr_max: maxDeposit,
        endDate: endDate,
        lead_comission: comissionOfHolder,
        comissionPaymentAddress,
        comission: comissionOfIcoWorld
    }
}

// Compose pool object properties (that needed for result of pool's search) for UI
export function getPoolData(pool) {
    return {
        poolId: pool._id,
        poolName: pool.poolName,
        status: pool.status,
        ownerId: pool.owner._id,
        ownerName: pool.owner.name,
        projectName: pool.name,
        projectAdress: pool.wallet.address,
        poolSoftCap: pool.sum_min,
        poolHardCap: pool.sum_max,
        minDeposit: pool.sum_mbr_min,
        maxDeposit: pool.sum_mbr_max,
        endDate: pool.endDate,
        comissionOfHolder: pool.lead_comission,
        comissionOfIcoWorld: pool.comission,
    }
}

export function getPoolDataForSearchResult(pool) {
    return {
        poolId: pool._id,
        poolName: pool.poolName,
        ownerId: pool.owner._id,
        ownerName: pool.owner.name,
        projectName: pool.name,
        endDate: pool.endDate
    }
}

export function generatePoolName() {
    const number = Math.floor(Math.random() * 1000)
    const date = new Date();
    const year = date.getFullYear().toString().slice(2);
    const month = date.getMonth() + 1;
    const dateOFMonth = date.getDate()
    const poolName = `${number}-${dateOFMonth}/${month}/${year}`;
    return poolName;
}

export default mongoose.model('Pool', schema);