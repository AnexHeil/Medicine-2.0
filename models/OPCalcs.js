const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const OPCalc = new Schema({
    research: {
        type: Schema.Types.ObjectId,
        ref: 'opResearches',
        required: true
    },
    css1Change: {
        type: Number,
        required: true
    },
    sad1Change: {
        type: Number,
        required: true
    },
    dad1Change: {
        type: Number,
        required: true
    },
    css2Change: {
        type: Number,
        required: true
    },
    sad2Change: {
        type: Number,
        required: true
    },
    dad2Change: {
        type: Number,
        required: true
    },
    ap: {
        type: Number,
        required: true
    },
    ik: {
        type: Number,
        required: true
    },
    tsk: {
        type: Number,
        required: true
    },
    pdp: {
        type: Number,
        required: true
    },
    patalogys: {
        type: String,
        required: true
    },
    points: {
        type: Number,
        required: true
    }
});
mongoose.model('opCalcs', OPCalc, 'opCalcs');