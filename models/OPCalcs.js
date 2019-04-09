const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const PRCalc = new Schema({
    research: {
        type: Schema.Types.ObjectId,
        ref: 'prResearches',
        required: true
    },
    patalogys: {
        type: String,
        required: true
    }
});
mongoose.model('prCalcs', PRCalc, 'prCalcs');