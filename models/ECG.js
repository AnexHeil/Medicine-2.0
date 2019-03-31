const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ECGSchema = new Schema({
    student: {
        type: Schema.Types.ObjectId,
        ref: 'students',
        required: true
    },
    CSS: {
        type: Number,
        required: true
    },
    PR:{
        type: Number,
        required: true
    },
    QRS:{
        type: Number,
        required: true
    },
    QT:{
        type: Number,
        required: true
    },
    QTcor:{
        type: Number,
        required: true
    },
    Axis:{
        type: Number,
        required: true
    },
    RV5:{
        type: Number,
        required: true
    },
    SV1:{
        type: Number,
        required: true
    },
    RS:{
        type: Number,
        required: true
    },
    Note:{
        type: String,
    },
    researchDate:{
        type: Date,
        required: true
    },
});
mongoose.model('ecgResearches', ECGSchema, 'ecgResearches');