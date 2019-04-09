const express = require('express');
const router = express.Router();
const mongose = require('mongoose');
require('../../models/ShG');
const ShG = mongose.model('shGResearches');
require('../../models/ShGCalcs');
const ShGcalcs = mongose.model('shgCalcs');
require('../../models/Student');
const Student = mongose.model('students');
const { searchAnalysis, formGroups, formAnalysisForStudent } = require('../../heplers/search');
const { ensureAuthenticated, ensureUser } = require('../../heplers/auth');
const { calculateShG } = require('../../heplers/calcs');
let searchParams;
router.get('/', ensureAuthenticated, ensureUser, (req, res) => {
    Student.find({})
        .then(students => {
            const groups = formGroups(students);
            ShGcalcs.find({})
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
                        res.render('analysis/shgIndex', { data: result, students: students, groups: groups, way: '/analysis/shg' });
                    }
                    else {
                        res.render('analysis/shgIndex', { data: data, students: students, groups: groups, way: '/analysis/shg' });
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
    res.redirect('/analysis/shg');
});
router.get('/perform', ensureAuthenticated, ensureUser, async (req, res) => {
    let errors = 0;
    ShG.find({})
    .populate('student')
        .then(shgResearches => {
            shgResearches.forEach(shg => {
                ShGcalcs.findOne({ research: shg._id })
                    .then(research => {
                        if (!research) {
                            let analysis = calculateShG(shg);
                            ShGcalcs.create(analysis);
                        }
                    })
            });
            req.flash('success_msg', 'Анализ всех доступных данных Пробы Штанге/Генчи успешно произведён.');
            res.redirect('/analysis/shg');
        })
});
module.exports = router;