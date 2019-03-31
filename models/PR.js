const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PRResearchSchema = new Schema({
    student: {
        type: Schema.Types.ObjectId,
        ref: 'students',
        required: true
    },
    p0: {
        type: Number,
        required: true
    },
    p1:{
        type: Number,
        required: true
    },
    p2: {
        type: Number,
        required: true
    },
    researchDate: {
        type: Date,
        required: true
    }
});
mongoose.model('prResearches', PRResearchSchema, 'prResearches');