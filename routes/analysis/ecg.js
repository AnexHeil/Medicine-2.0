const express = require('express');
const router = express.Router();
const mongose = require('mongoose');
require('../../models/ECG');
const ECG = mongose.model('ecgResearches');
require('../../models/ECGCalcs');
const ECGCalcs = mongose.model('ecgCalcs');
require('../../models/Student');
const Student = mongose.model('students');
const { searchAnalysis, formGroups, formAnalysisForStudent } = require('../../heplers/search');
const { ensureAuthenticated, ensureUser } = require('../../heplers/auth');
const { calculateECG } = require('../../heplers/calcs');
let searchParams;
router.get('/', ensureAuthenticated, ensureUser, (req, res) => {
    Student.find({})
        .then(students => {
            const groups = formGroups(students);
            ECGCalcs.find({})
                .populate({
                    path: 'research',
                    populate: { path: 'student' }
                })
                .then(data => {
                    if (req.user.status == 'student') {
                        data = formAnalysisForStudent(req.user.username, data);
                    }
                    if (searchParams) {
                        result = searchAnalysis(data, searchParams);
                        searchParams = undefined;
                        res.render('analysis/ecgIndex', { data: result, students: students, groups: groups, way: '/ecg', way2: '/ecg', way3: '/analysis/ecg' });
                    }
                    else {
                        res.render('analysis/ecgIndex', { data: data, students: students, groups: groups, way: '/ecg', way2: '/ecg', way3: '/analysis/ecg' });
                    }
                })
                .catch(err => {
                    console.log(err);
                    req.flash('error_msg', `Возникла критическая ошибка. Попробуйте повторить операцию позже.`);
                    res.redirect('/');
                });
        });
});
router.post('/search', (req, res) => {
    searchParams = req.body;
    res.redirect('/analysis/ecg');
});
router.get('/perform', ensureAuthenticated, ensureUser, async (req, res) => {
    let errors = 0;
    ECG.find({})
        .then(ecgResearches => {
            ecgResearches.forEach(ecg => {
                ECGCalcs.findOne({ research: ecg._id })
                    .then(research => {
                        if (!research) {
                            let analysis = calculateECG(ecg);
                            ECGCalcs.create(analysis);
                        }
                    })
            });
            req.flash('success_msg', 'Анализ всех доступных данных ЭКГ успешно произведён.');
            res.redirect('/analysis/ecg');
        })
});
module.exports = router;