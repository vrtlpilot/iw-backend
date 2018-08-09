import mongoose = require('mongoose');

// Image schema definition.
export const Image = new mongoose.Schema({
    name: String,
    data: {
        type: Buffer,
        required: true
    },
    fmt: {
        type: String,
        required: true
    }
});
  
export default mongoose.model('Image', Image);