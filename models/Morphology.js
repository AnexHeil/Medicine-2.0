const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MorhResearchSchema = new Schema({
    student: {
        type: Schema.Types.ObjectId,
        ref: 'students',
        required: true
    },
    faceHeight:{
        type: Number,
        required: true
    },
    cheeckWidth: {
        type: Number,
        required: true
    },
    wristLengthRight:{
        type: Number,
        required: true
    },
    wristLengthLeft:{
        type: Number,
        required: true
    },
    middleFingerTestRight:{
        type: Number,
        required: true
    },
    middleFingerTestLeft:{
        type: Number,
        required: true
    },
    bigFingerTestRight:{
        type: Number,
        required: true
    },
    bigFingerTestLeft:{
        type: Number,
        required: true
    },
    wristTestRight:{
        type: Number,
        required: true
    },
    wristTestLeft:{
        type: Number,
        required: true
    },
    TMP:{
        type: Number,
        required: true
    },
    TML:{
        type: Number,
        required: true
    },
    TBPPR:{
        type: Number,
        required: true
    },
    TBPLR:{
        type: Number,
        required: true
    },
    PLS:{
        type: Number,
        required: true
    },
    LLS:{
        type: Number,
        required: true
    },
    PKS:{
        type: Number,
        required: true
    },
    LKS:{
        type: Number,
        required: true
    },
    TPP:{
        type: Number,
        required: true
    },
    legSize:{
        type: Number,
        required: true
    },
    researchDate: {
        type: Date,
        required: true
    }
});
mongoose.model('morphologyResearches', MorhResearchSchema, 'morphologyResearches');