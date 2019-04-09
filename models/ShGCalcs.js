const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ShGCalc = new Schema({
    research: {
        type: Schema.Types.ObjectId,
        ref: 'shGResearches',
        required: true
    },
    patalogys: {
        type: String,
        required: true
    }
});
mongoose.model('shgCalcs', ShGCalc, 'shgCalcs');