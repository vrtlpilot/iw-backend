import mongoose = require('mongoose');

const schema = new mongoose.Schema({
    data: {
        type: Buffer,
        required: true
    },
    fmt: {
        type: String,
        required: true
    }
});
  
export default mongoose.model('Image', schema);