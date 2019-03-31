const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SpyroResearchSchema = new Schema({
    student: {
        type: Schema.Types.ObjectId,
        ref: 'students',
        required: true
    },
    jel: {
        type: Number,
        required: true
    },
    stanPower:{
        type: Number,
        required: true
    },
    wristPower: {
        type: Number,
        required: true
    },
    researchDate: {
        type: Date,
        required: true
    }
});
mongoose.model('spyroResearches', SpyroResearchSchema, 'spyroResearches');