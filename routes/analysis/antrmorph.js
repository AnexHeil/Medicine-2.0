const express = require('express');
const router = express.Router();
const mongose = require('mongoose');
require('../../models/Antropology');
const Antropology = mongose.model('antropologyResearches');
require('../../models/Morphology');
const Morphology = mongose.model('morphologyResearches');
require('../../models/AntrMorphCalc');
const AntrMorphCalc = mongose.model('antrMorphCalcs');
require('../../models/Student');
const Student = mongose.model('students');
const { searchAnalysis, formGroups, formAnalysisForStudent } = require('../../heplers/search');
const { ensureAuthenticated, ensureUser } = require('../../heplers/auth');
const { calculateAntrMorphData } = require('../../heplers/calcs');
let searchParams;
router.get('/', ensureAuthenticated, ensureUser, (req, res) => {
    Student.find({})
        .then(students => {
            const groups = formGroups(students);
            AntrMorphCalc.find({})
                .populate({
                    path: 'research',
                    populate: {path : 'student'}
                })
                .then(data => {
                    if (req.user.status == 'student') {
                        data = formAnalysisForStudent(req.user.username, data);
                    }
                    if (searchParams) {
                        result = searchAnalysis(data, searchParams);
                        searchParams = undefined;
                        res.render('analysis/antrMorphIndex', { data: result, students: students, groups: groups, way: '/analysis/antrmorph' });
                    }
                    else {
                        res.render('analysis/antrMorphIndex', { data: data, students: students, groups: groups, way: '/analysis/antrmorph' });
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
    res.redirect('/analysis/antrmorph');
});
router.get('/perform', ensureAuthenticated, ensureUser, async (req, res) => {
    let errors = 0;
    Antropology.find({})
        .then(antropologyResearches => {
            antropologyResearches.forEach(antropology => {
                Morphology.findOne({ student: antropology.student, researchDate: antropology.researchDate })
                    .then(morphology => {
                        if (morphology) {
                            AntrMorphCalc.findOne({ research: antropology._id })
                                .then(research => {
                                    if (!research) {
                                        let analysis = calculateAntrMorphData(antropology, morphology);
                                        AntrMorphCalc.create(analysis)
                                    }
                                })
                        }
                        else {
                            errors++;
                        }
                    })
            });
            if (errors == 0)
                req.flash('success_msg', 'Анализ всех доступных данных антропометрметрических и морфологических данных успешно произведён.');
            else
                req.flash(req.flash('success_msg', 'Анализ некоторых антропометрметрических и морфологических данных не был произведён ввиду их отсутсвия. Убедитесь, что вы внесли все необходимые данные.'));
            res.redirect(`/analysis/antrmorph`);
        });
});
module.exports = router;