const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PhysicsSchema = new Schema({
    student: {
        type: Schema.Types.ObjectId,
        ref: 'students',
        required: true
    },
    run30m: {
        type: Number,
        required: true
    },
    jump: {
        type: Number,
        required: true
    },
    chelnRun: {
        type: Number,
        required: true
    },
    press: {
        type: Number,
        required: true
    },
    run1000: {
        type: Number,
        required: true
    },
    push: {
        type: Number,
        required: true
    },
    incline: {
        type: Number,
        required: true
    },
    stanDinam: {
        type: Number,
        required: true
    },
    wristDinamRight: {
        type: Number,
        required: true
    },
    wristDinamLeft: {
        type: Number,
        required: true
    },
    researchDate: {
        type: Date,
        required: true
    }
});
mongoose.model('physicResearches', PhysicsSchema, 'physicResearches');