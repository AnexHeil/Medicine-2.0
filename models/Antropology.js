const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AntropologyResearchSchema = new Schema({
    student: {
        type: Schema.Types.ObjectId,
        ref: 'students',
        required: true
    },
    stayHeight: {
        type: Number,
        required: true
    },
    sitHeight:{
        type: Number,
        required: true
    },
    handWidth: {
        type: Number,
        required: true
    },
    weight: {
        type: Number,
        required: true
    },
    chestOnBreath:{
        type: Number,
        required: true
    },
    chestOnFullBreath:{
        type: Number,
        required: true
    },
    chestOnMaxBreath: {
        type: Number,
        required: true
    },
    beltVolume: {
        type: Number,
        required: true
    },
    hipVolume: {
        type: Number,
        required: true
    },
    researchDate: {
        type: Date,
        required: true
    }
});
mongoose.model('antropologyResearches', AntropologyResearchSchema, 'antropologyResearches');