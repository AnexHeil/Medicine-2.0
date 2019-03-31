const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OPResearchSchema = new Schema({
    student: {
        type: Schema.Types.ObjectId,
        ref: 'students',
        required: true
    },
    p0: {
        type: Number,
        required: true
    },
    sad0:{
        type: Number,
        required: true
    },
    dad0: {
        type: Number,
        required: true
    },
    p1: {
        type: Number,
        required: true
    },
    sad1:{
        type: Number,
        required: true
    },
    dad1:{
        type: Number,
        required: true
    },
    p2: {
        type: Number,
        required: true
    },
    sad2: {
        type: Number,
        required: true
    },
    dad2: {
        type: Number,
        required: true
    },
    researchDate: {
        type: Date,
        required: true
    }
});
mongoose.model('opResearches', OPResearchSchema, 'opResearches');