import mongoose = require('mongoose');

const Schema = mongoose.Schema;

const schema = new Schema({
    name: {
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
    company: {
        type: String,
        required: true
    }
},
    {
        timestamps: true
    }
);

schema.set('toJSON', {
    virtuals: true
});

export default mongoose.model('User', schema);
