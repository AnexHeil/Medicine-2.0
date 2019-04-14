const express = require('express');
const router = express.Router();
const mongose = require('mongoose');
require('../../models/Spyro');
const Spyro = mongose.model('spyroResearches');
require('../../models/SpyroCalcs');
const SpyroCalc = mongose.model('spyroCalcs');
require('../../models/Student');
const Student = mongose.model('students');
const { searchAnalysis, formGroups, formAnalysisForStudent } = require('../../heplers/search');
const { ensureAuthenticated, ensureUser } = require('../../heplers/auth');
const { calculateSpyro } = require('../../heplers/calcs');
require('../../models/Antropology');
const Antropology = mongose.model('antropologyResearches');
let searchParams;
router.get('/', ensureAuthenticated, ensureUser, (req, res) => {
    Student.find({})
        .then(students => {
            const groups = formGroups(students);
            SpyroCalc.find({})
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
                        res.render('analysis/spyroIndex', { data: result, students: students, groups: groups,way: '/spyro', way2: '/spyro', way3: '/analysis/spyro' });
                    }
                    else {
                        res.render('analysis/spyroIndex', { data: data, students: students, groups: groups, way: '/spyro', way2: '/spyro', way3: '/analysis/spyro' });
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
    res.redirect('/analysis/spyro');
});
router.get('/perform', ensureAuthenticated, ensureUser, async (req, res) => {
    let errors = 0;
    Spyro.find({})
    .populate('student')
        .then(spyroResearches => {
            spyroResearches.forEach(spyro => {
                SpyroCalc.findOne({ research: spyro._id })
                    .then(research => {
                        if (!research) {
                            Antropology.findOne({student: spyro.student, researchDate: spyro.researchDate})
                                .then(antropology =>{
                                    if(antropology){
                                        let calcs = calculateSpyro(antropology.weight, spyro);
                                        SpyroCalc.create(calcs);
                                    }
                                })
                        }
                    })
            });
            req.flash('success_msg', 'Анализ всех доступных данных Пробы Штанге/Генчи успешно произведён.');
            res.redirect('/analysis/spyro');
        })
});
module.exports = router;