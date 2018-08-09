import mongoose = require('mongoose');

// Wallet schema definition.
const schema = new mongoose.Schema({
    kind: {
        type: String,
        default: 'ETH'
    },
    address: String,
});

export default schema;