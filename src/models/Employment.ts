import mongoose = require('mongoose');

const schema = new mongoose.Schema({
    company: String,
    position: String
});
export default mongoose.model('Employment', schema);