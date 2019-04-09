const express = require('express');
const router = express.Router();
const mongose = require('mongoose');
require('../../models/PR');
const PR = mongose.model('prResearches');
require('../../models/PRCalcs');
const PRCalcs = mongose.model('prCalcs');
require('../../models/Student');
const Student = mongose.model('students');
const { searchAnalysis, formGroups, formAnalysisForStudent } = require('../../heplers/search');
const { ensureAuthenticated, ensureUser } = require('../../heplers/auth');
const { calculatePR } = require('../../heplers/calcs');
let searchParams;
router.get('/', ensureAuthenticated, ensureUser, (req, res) => {
    Student.find({})
        .then(students => {
            const groups = formGroups(students);
            PRCalcs.find({})
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
                        res.render('analysis/prIndex', { data: result, students: students, groups: groups, way: '/analysis/pr' });
                    }
                    else {
                        res.render('analysis/prIndex', { data: data, students: students, groups: groups, way: '/analysis/pr' });
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
    res.redirect('/analysis/pr');
});
router.get('/perform', ensureAuthenticated, ensureUser, async (req, res) => {
    let errors = 0;
    PR.find({})
        .then(prResearches => {
            prResearches.forEach(pr => {
                PRCalcs.findOne({ research: pr._id })
                    .then(research => {
                        if (!research) {
                            let analysis = calculatePR(pr);
                            PRCalcs.create(analysis);
                        }
                    })
            });
            req.flash('success_msg', 'Анализ всех доступных данных Пробы Руфье успешно произведён.');
            res.redirect('/analysis/pr');
        })
});
module.exports = router;