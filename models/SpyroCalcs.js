const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const SpyroCalc = new Schema({
    research: {
        type: Schema.Types.ObjectId,
        ref: 'spyroResearches',
        required: true
    },
    gi: {
        type: Number,
        required: true
    },
    pomsmt1: {
        type: Number,
        required: true
    },
    pomsmt2: {
        type: Number,
        required: true
    },
    patalogys: {
        type: String,
        required: true
    }
});
mongoose.model('spyroCalcs', SpyroCalc, 'spyroCalcs');