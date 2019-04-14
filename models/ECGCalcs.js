const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ECGCalc = new Schema({
    research: {
        type: Schema.Types.ObjectId,
        ref: 'ecgResearches',
        required: true
    },
    patalogys: {
        type: String,
        required: true
    }
});
mongoose.model('ecgCalcs', ECGCalc, 'ecgCalcs');