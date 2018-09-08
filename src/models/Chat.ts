import mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

// Chat schema definition.
const schema = new Schema({
    userId: {
        type: ObjectId,
        ref: 'User',
        required: true
    },
    messages: [{
        type: ObjectId,
        ref: 'Message'
    }]
});
  
export default mongoose.model('Chat', schema);