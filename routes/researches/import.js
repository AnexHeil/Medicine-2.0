const express = require('express');
const router = express.Router();
const mongose = require('mongoose');
require('../../models/Antropology');
const Antropology = mongose.model('antropologyResearches');
require('../../models/Morphology');
const Morphology = mongose.model('morphologyResearches');
require('../../models/ECG');
const ECG = mongose.model('ecgResearches');
require('../../models/OP');
const OP = mongose.model('opResearches');
require('../../models/PR');
const PR = mongose.model('prResearches');
require('../../models/ShG');
const ShG = mongose.model('shGResearches');
require('../../models/Spyro');
const Spyro = mongose.model('spyroResearches');
require('../../models/Student');
const Student = mongose.model('students');
const XLSX = require('xlsx');
const Path = require('path');
const { ensureAuthenticated, ensureUser } = require('../../heplers/auth');

router.get('/', ensureAuthenticated, (req, res) => {
    res.render('researches/import');
});

router.post('/', ensureAuthenticated, (req, res) => {
    let researchType = req.body.research;
    let filepath = Path.resolve('D:/Materials/', req.body.file);
    let workbook = XLSX.readFile(filepath);
    let Model;
    Student.find({})
        .then(students => {
            let index;
            switch (researchType) {
                case 'antr':
                    Model = Antropology;
                    index = 0;
                    break;
                case 'morph':
                    Model = Morphology;
                    index = 1;
                    break;
                case 'spyro':
                    Model = Spyro;
                    index = 2;
                    break;
                case 'shg':
                    Model = ShG;
                    index = 3;
                    break;
                case 'pr':
                    Model = PR;
                    index = 4;
                    break;
                case 'ecg':
                    Model = ECG;
                    index = 5;
                    break;
                case 'op':
                    Model = OP;
                    index = 6;
                    break;
            };
            let research = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[index]]);
            let isExist = false;
            for (let i = 0; i < research.length; i++) {

                for (let j = 0; j < students.length; j++) {
                    if (JSON.stringify(research[i][Object.keys(research[i])[1]]) == JSON.stringify(students[j].studentNumber)) {
                        isExist = true;
                        research[i].studentID = students[j]._id;
                        break;
                    }
                }
                if (isExist == false) {
                    research.splice(i, 1);
                }
                isExist = false;
            }
            if(!research[0].studentID){
                for(let i = 0; i < students.length; i++){
                    if (JSON.stringify(research[0][Object.keys(research[0])[1]]) == JSON.stringify(students[i].studentNumber)) {
                        isExist = true;
                        research[0].studentID = students[i]._id;
                        break;
                    }
                }
            }
            Model.find({})
                .then(existingResearches => {
                    isExist = false;
                    for (let i = 0; i < existingResearches.length; i++) {
                        for (let j = 0; j < research.length; j++) {
                            if (JSON.stringify(existingResearches[i].student) == JSON.stringify(research[j].studentID) && new Date(req.body.date).getTime() == existingResearches[i].researchDate.getTime()) {
                                research.splice(j, 1);
                                break;
                            }
                        }
                    }
                    let data = [];
                    let backflip, message;
                    switch (researchType) {
                        case 'antr':
                            data = formAntrData(research, req.body.date);
                            backflip = '/antropology';
                            message = 'антропологического'
                            break;
                        case 'morph':
                            data = formMorphData(research, req.body.date);
                            backflip = '/morphology';
                            message = 'морфологического'
                            break;
                        case 'spyro':
                            data = formSpyroData(research, req.body.date);
                            Model = Spyro;
                            backflip = '/spyro';
                            message = 'спирографического'
                            break;
                        case 'shg':
                            data = formShGData(research, req.body.date);
                            Model = ShG;
                            backflip = '/shg';
                            message = 'Ш/Г'
                            break;
                        case 'pr':
                            data = formPRData(research, req.body.date);
                            Model = PR;
                            backflip = '/pr';
                            message = 'ПР'
                            break;
                        case 'ecg':
                            data = formECGData(research, req.body.date);
                            Model = ECG;
                            backflip = '/ecg';
                            message = 'ЭКГ'
                            break;
                        case 'op':
                            data = formOPData(research, req.body.date);
                            Model = OP;
                            backflip = '/op';
                            message = 'ОП'
                            break;
                    };
                    Model.insertMany(data)
                        .then(data => {
                            req.flash('success_msg', `Импорт ${message} обследования успешно завершён`);
                            res.redirect(backflip);
                        })
                        .catch(err => {
                            req.flash('error_msg', `Возникла критическая ошибка. Попробуйте повторить операцию позже.`);
                            res.redirect(backflip);
                        });
                });
        })
});
function formAntrData(research, date) {
    data = [];
    for (let i = 0; i < research.length; i++) {
        data.push({
            student: research[i].studentID,
            stayHeight: research[i][Object.keys(research[i])[2]],
            sitHeight: research[i][Object.keys(research[i])[3]],
            handWidth: research[i][Object.keys(research[i])[4]],
            weight: research[i][Object.keys(research[i])[5]],
            chestOnBreath: research[i][Object.keys(research[i])[6]],
            chestOnFullBreath: research[i][Object.keys(research[i])[7]],
            chestOnMaxBreath: research[i][Object.keys(research[i])[8]],
            beltVolume: research[i][Object.keys(research[i])[9]],
            hipVolume: research[i][Object.keys(research[i])[10]],
            researchDate: date
        });
    }
    return data;
}
function formMorphData(research, date) {
    data = [];
    for (let i = 0; i < research.length; i++) {
        data.push({
            student: research[i].studentID,
            faceHeight: research[i][Object.keys(research[i])[2]],
            cheeckWidth: research[i][Object.keys(research[i])[3]],
            wristLengthRight: research[i][Object.keys(research[i])[4]],
            wristLengthLeft: research[i][Object.keys(research[i])[5]],
            middleFingerTestRight: research[i][Object.keys(research[i])[6]],
            middleFingerTestLeft: research[i][Object.keys(research[i])[7]],
            bigFingerTestRight: research[i][Object.keys(research[i])[8]],
            bigFingerTestLeft: research[i][Object.keys(research[i])[9]],
            wristTestRight: research[i][Object.keys(research[i])[10]],
            wristTestLeft: research[i][Object.keys(research[i])[11]],
            TMP: research[i][Object.keys(research[i])[12]],
            TML: research[i][Object.keys(research[i])[13]],
            TBPPR: research[i][Object.keys(research[i])[14]],
            TBPLR: research[i][Object.keys(research[i])[15]],
            PLS: research[i][Object.keys(research[i])[16]],
            LLS: research[i][Object.keys(research[i])[17]],
            PKS: research[i][Object.keys(research[i])[18]],
            LKS: research[i][Object.keys(research[i])[19]],
            TPP: research[i][Object.keys(research[i])[20]],
            legSize: research[i][Object.keys(research[i])[21]],
            researchDate: date
        });
    }
    return data;
}
function formSpyroData(research, date) {
    data = [];
    for (let i = 0; i < research.length; i++) {
        data.push({
            student: research[i].studentID,
            jel: research[i][Object.keys(research[i])[2]],
            stanPower: research[i][Object.keys(research[i])[3]],
            wristPower: research[i][Object.keys(research[i])[4]],
            researchDate: date
        });
    }
    return data;
}
function formShGData(research, date) {
    data = [];
    for (let i = 0; i < research.length; i++) {
        data.push({
            student: research[i].studentID,
            shtange: research[i][Object.keys(research[i])[2]],
            genchi: research[i][Object.keys(research[i])[3]],
            researchDate: date
        });
    }
    return data;
}
function formPRData(research, date) {
    data = [];
    for (let i = 0; i < research.length; i++) {
        data.push({
            student: research[i].studentID,
            p0: research[i][Object.keys(research[i])[2]],
            p1: research[i][Object.keys(research[i])[3]],
            p2: research[i][Object.keys(research[i])[4]],
            researchDate: date
        });
    }
    return data;
}
function formECGData(research, date) {
    data = [];
    for (let i = 0; i < research.length; i++) {
        data.push({
            student: research[i].studentID,
            CSS: research[i][Object.keys(research[i])[2]],
            PR: research[i][Object.keys(research[i])[3]],
            QRS: research[i][Object.keys(research[i])[4]],
            QT: research[i][Object.keys(research[i])[4]],
            QTcor: research[i][Object.keys(research[i])[5]],
            Axis: research[i][Object.keys(research[i])[6]],
            RV5: research[i][Object.keys(research[i])[7]],
            SV1: research[i][Object.keys(research[i])[8]],
            RS: research[i][Object.keys(research[i])[9]],
            Note: research[i][Object.keys(research[i])[10]],
            researchDate: date
        });
    }
    return data;
}
function formOPData(research, date) {
    data = [];
    for (let i = 0; i < research.length; i++) {
        data.push({
            student: research[i].studentID,
            p0: research[i][Object.keys(research[i])[2]],
            sad0: research[i][Object.keys(research[i])[3]],
            dad0: research[i][Object.keys(research[i])[4]],
            p1: research[i][Object.keys(research[i])[4]],
            sad1: research[i][Object.keys(research[i])[5]],
            dad1: research[i][Object.keys(research[i])[6]],
            p2: research[i][Object.keys(research[i])[7]],
            sad2: research[i][Object.keys(research[i])[8]],
            dad2: research[i][Object.keys(research[i])[9]],
            researchDate: date
        });
    }
    return data;
}
module.exports = router;