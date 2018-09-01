import mongoose = require('mongoose');

// Contract schema definition.
export const Contract = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: String,
    src: {
        type: String,
        required: true
    },
    abi: {
        type: String,
        required: true
    },
    bin: {
        type: String,
        required: true
    }
});
  
export default mongoose.model('Contract', Contract);