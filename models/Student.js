const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StudentSchema = new Schema({
    studentNumber: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    patronymic: {
        type: String,
        required: true
    },
    group: {
        type: String,
        required: true
    },
    birthDate: {
        type: Date
    },
    sex: {
        type: String,
        required: true
    }
});
mongoose.model('students', StudentSchema);