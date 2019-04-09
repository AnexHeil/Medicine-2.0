const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AntrMorphCalc = new Schema({
    research: {
        type: Schema.Types.ObjectId,
        ref: 'antropologyResearches',
        required: true
    },
    imt: {
        type: Number,
        required: true
    },
    svstn: {
        type: Number,
        required: true
    },
    orr: {
        type: Number,
        required: true
    },
    odkr: {
        type: Number,
        required: true
    },
    faceIndex: {
        type: Number,
        required: true
    },
    pe: {
        type: Number,
        required: true
    },
    ri: {
        type: Number,
        required: true
    },
    rp: {
        type: Number,
        required: true
    },
    points: {
        type: Number,
        required: true
    },
    patalogys:{
        type: String,
        required: true
    }
});
mongoose.model('antrMorphCalcs', AntrMorphCalc, 'antrMorphCalcs');