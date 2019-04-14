const express = require('express');
const router = express.Router();
const mongose = require('mongoose');
require('../../models/Spyro');
const Spyro = mongose.model('spyroResearches');
require('../../models/SpyroCalcs');
const SpyroCalc = mongose.model('spyroCalcs');
require('../../models/Antropology');
const Antropology = mongose.model('antropologyResearches');
require('../../models/Student');
const Student = mongose.model('students');
const { searchResearches, formGroups, formForStudent } = require('../../heplers/search');
const { ensureAuthenticated, ensureUser } = require('../../heplers/auth');
const { calculateSpyro } = require('../../heplers/calcs');
let searchParams;
router.get('/add', ensureAuthenticated, ensureUser, (req, res) => {
    res.render('researches/spyro/add');
});

router.get('/', ensureAuthenticated, (req, res) => {
    Student.find({})
        .then(students => {
            const groups = formGroups(students);
            Spyro.find({})
                .populate('student')
                .then(researches => {
                    if (req.user.status == 'student') {
                        researches = formForStudent(req.user.username, researches);
                    }
                    if (searchParams) {
                        result = searchResearches(researches, searchParams);
                        searchParams = undefined;
                        res.render('researches/spyro/index', { researches: result, students: students, groups: groups, way: '/spyro', way2: '/spyro', way3: '/spyro' });
                    }
                    else {
                        res.render('researches/spyro/index', { researches: researches, students: students, groups: groups, way: '/spyro', way2: '/spyro', way3: '/spyro' });
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
    res.redirect('/spyro');
});

router.post('/', ensureAuthenticated, ensureUser, async (req, res) => {
    let errors = [];
    let newResearch = req.body.research;
    await Student.findOne({ studentNumber: req.body.studentNumber })
        .then(async function (student) {
            if (student) {
                let studentID = student._id;
                await Spyro.findOne({ researchDate: newResearch.researchDate, student: studentID })
                    .then(research => {
                        if (research) {
                            errors.push({ text: 'Обследование этого студента в указанное время уже зарегестрированно.' });
                        }
                        else {
                            newResearch.student = studentID;
                            Spyro.create(newResearch)
                                .then(research => {
                                    req.flash('Исследование успешно зарегестрированно.')
                                    res.redirect('/spyro');
                                });
                        }
                    })
                    .catch(err => {
                        console.log(err);
                        req.flash('error_msg', `Возникла критическая ошибка. Попробуйте повторить операцию позже.`);
                        res.redirect('/spyro');
                    })
            }
            else {
                errors.push({ text: 'Указанный студент не зарегестрирован.' });
            }
        })
        .catch(err => {
            console.log(err);
            req.flash('error_msg', `Возникла критическая ошибка. Попробуйте повторить операцию позже.`);
            res.redirect('/spyro');
        });
    if (errors.length > 0) {
        res.render('researches/spyro/add', { errors: errors, research: newResearch });
    }
});
router.get('/:id/edit', ensureAuthenticated, ensureUser, (req, res) => {
    Spyro.findById(req.params.id)
        .populate('student')
        .then(research => {
            if (research) {
                res.render('researches/spyro/edit', { research: research });
            }
            else {
                req.flash('error_msg', `Исследование не найдено.`);
                res.redirect('/spyro');
            }
        })
        .catch(err => {
            req.flash('error_msg', `Возникла критическая ошибка. Попробуйте повторить операцию позже.`);
            res.redirect('/spyro');
        });
});
router.put('/:id', ensureAuthenticated, ensureUser, (req, res) => {
    Spyro.findByIdAndUpdate(req.params.id, req.body.research)
        .then(research => {
            SpyroCalc.findOne({ research: research._id })
                .then(calc => {
                    if (calc) {
                        Antropology.findOne({ student: research.student, researchDate: research.researchDate })
                            .then(antropology => {
                                let calcs = calculateSpyro(antropology.weight, research);
                                SpyroCalc.findByIdAndUpdate(calc._id, calcs)
                                    .then(spyro => {
                                        req.flash('success_msg', 'Данные исследования успешно изменены.')
                                        res.redirect('/spyro');
                                    })
                            })
                    }
                })
        })
        .catch(err => {
            req.flash('error_msg', `Возникла критическая ошибка. Попробуйте повторить операцию позже.`);
            res.redirect('/spyro');
        });
});
router.delete('/:id', ensureAuthenticated, ensureUser, (req, res) => {
    Spyro.findByIdAndDelete(req.params.id)
        .then(research => {
            req.flash('success_msg', `Обследование успешно удалено.`);
            res.redirect('/spyro');
        })
        .catch(err => {
            req.flash('error_msg', `Возникла критическая ошибка. Попробуйте повторить операцию позже.`);
            res.redirect('/spyro');
        });
})
module.exports = router;