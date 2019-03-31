const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ShGResearchSchema = new Schema({
    student: {
        type: Schema.Types.ObjectId,
        ref: 'students',
        required: true
    },
    shtange: {
        type: Number,
        required: true
    },
    genchi:{
        type: Number,
        required: true
    },
    researchDate: {
        type: Date,
        required: true
    }
});
mongoose.model('shGResearches', ShGResearchSchema, 'shGResearches');