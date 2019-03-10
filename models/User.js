const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    password: {
        type: String,
        required: true
    },
    studentNumber: {
        type: String
    },
    status: {
        type: String
    }
});
mongoose.model('users', UserSchema);