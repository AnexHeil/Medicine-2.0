const express = require('express');
const router = express.Router();
const mongose = require('mongoose');
require('../../models/ShG');
const ShG = mongose.model('shGResearches');
require('../../models/ShGCalcs');
const ShGcalcs = mongose.model('shgCalcs')
require('../../models/Student');
const Student = mongose.model('students');
const { searchResearches, formGroups, formForStudent } = require('../../heplers/search');
const { ensureAuthenticated, ensureUser } = require('../../heplers/auth');
const { calculateShG } = require('../../heplers/calcs');
let searchParams;
router.get('/add', ensureAuthenticated, ensureUser, (req, res) => {
    res.render('researches/shg/add');
});

router.get('/', ensureAuthenticated, (req, res) => {
    Student.find({})
        .then(students => {
            const groups = formGroups(students);
            ShG.find({})
                .populate('student')
                .then(researches => {
                    if (req.user.status == 'student') {
                        researches = formForStudent(req.user.username, researches);
                    }
                    if (searchParams) {
                        result = searchResearches(researches, searchParams);
                        searchParams = undefined;
                        res.render('researches/shg/index', { researches: result, students: students, groups: groups, way: '/shg', way2: '/shg', way3: '/shg' });
                    }
                    else {
                        res.render('researches/shg/index', { researches: researches, students: students, groups: groups, way: '/shg', way2: '/shg', way3: '/shg' });
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
    res.redirect('/shg');
});

router.post('/', ensureAuthenticated, ensureUser, async (req, res) => {
    let errors = [];
    let newResearch = req.body.research;
    await Student.findOne({ studentNumber: req.body.studentNumber })
        .then(async function (student) {
            if (student) {
                let studentID = student._id;
                await ShG.findOne({ researchDate: newResearch.researchDate, student: studentID })
                    .then(research => {
                        if (research) {
                            errors.push({ text: 'Обследование этого студента в указанное время уже зарегестрированно.' });
                        }
                        else {
                            newResearch.student = studentID;
                            ShG.create(newResearch)
                                .then(research => {
                                    req.flash('Исследование успешно зарегестрированно.')
                                    res.redirect('/shg');
                                });
                        }
                    })
                    .catch(err => {
                        console.log(err);
                        req.flash('error_msg', `Возникла критическая ошибка. Попробуйте повторить операцию позже.`);
                        res.redirect('/shg');
                    })
            }
            else {
                errors.push({ text: 'Указанный студент не зарегестрирован.' });
            }
        })
        .catch(err => {
            console.log(err);
            req.flash('error_msg', `Возникла критическая ошибка. Попробуйте повторить операцию позже.`);
            res.redirect('/shg');
        });
    if (errors.length > 0) {
        res.render('researches/shg/add', { errors: errors, research: newResearch });
    }
});

router.get('/:id/edit', ensureAuthenticated, ensureUser, (req, res) => {
    ShG.findById(req.params.id)
        .populate('student')
        .then(research => {
            if (research) {
                res.render('researches/shg/edit', { research: research });
            }
            else {
                req.flash('error_msg', `Исследование не найдено.`);
                res.redirect('/shg');
            }
        })
        .catch(err => {
            req.flash('error_msg', `Возникла критическая ошибка. Попробуйте повторить операцию позже.`);
            res.redirect('/shg');
        });
});
router.put('/:id', ensureAuthenticated, ensureUser, (req, res) => {
    ShG.findByIdAndUpdate(req.params.id, req.body.research)
        .then(research => {
            ShGcalcs.findOne({ research: research._id })
                .then(calc => {
                    if (calc) {
                        let calcs = calculateShG(research);
                        ShGcalcs.findByIdAndUpdate(calc._id, calcs)
                            .then(newCalcs => {
                                req.flash('success_msg', 'Данные исследования успешно изменены.')
                                res.redirect('/shg');
                            })
                    }
                    else {
                        req.flash('success_msg', 'Данные исследования успешно изменены.')
                        res.redirect('/pr');
                    }
                })
        })
        .catch(err => {
            req.flash('error_msg', `Возникла критическая ошибка. Попробуйте повторить операцию позже.`);
            res.redirect('/shg');
        });
});
router.delete('/:id', ensureAuthenticated, ensureUser, (req, res) => {
    ShG.findByIdAndDelete(req.params.id)
        .then(research => {
            req.flash('success_msg', `Обследование успешно удалено.`);
            res.redirect('/shg');
        })
        .catch(err => {
            req.flash('error_msg', `Возникла критическая ошибка. Попробуйте повторить операцию позже.`);
            res.redirect('/shg');
        });
})
module.exports = router;