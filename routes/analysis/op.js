const express = require('express');
const router = express.Router();
const mongose = require('mongoose');
require('../../models/OP');
const OP = mongose.model('opResearches');
require('../../models/OPCalcs');
const OPCalcs = mongose.model('opCalcs');
require('../../models/Student');
const Student = mongose.model('students');
require('../../models/Antropology');
const Antropology = mongose.model('antropologyResearches');
const { searchAnalysis, formGroups, formAnalysisForStudent } = require('../../heplers/search');
const { ensureAuthenticated, ensureUser } = require('../../heplers/auth');
const { calculateOP } = require('../../heplers/calcs');
let searchParams;
router.get('/', ensureAuthenticated, ensureUser, (req, res) => {
    Student.find({})
        .then(students => {
            const groups = formGroups(students);
            OPCalcs.find({})
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
                        res.render('analysis/opIndex', { data: result, students: students, groups: groups, way: '/op', way2: '/op', way3: '/analysis/op' });
                    }
                    else {
                        res.render('analysis/opIndex', { data: data, students: students, groups: groups, way: '/op', way2: '/op', way3: '/analysis/op' });
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
    res.redirect('/analysis/op');
});
router.get('/perform', ensureAuthenticated, ensureUser, async (req, res) => {
    let errors = 0;
    OP.find({})
        .then(op => {
            op.forEach(opResearch => {
                OPCalcs.findOne({ research: op._id })
                    .then(opCalc => {
                        if (!opCalc) {
                            Antropology.findOne({ student: opResearch.student, researchDate: opResearch.researchDate })
                                .then(antropology => {
                                    if (antropology) {
                                        Student.findById(opResearch.student)
                                            .then(student => {
                                                let calcs = calculateOP(opResearch, student, antropology);
                                                console.log(calcs);
                                                console.log(opResearch);
                                                OPCalcs.create(calcs)
                                            })
                                    }
                                })
                        }
                    })
            });
            req.flash('success_msg', 'Анализ всех доступных данных Ортостатической пробы успешно произведён.');
            res.redirect('/analysis/op');
        });
});

module.exports = router;