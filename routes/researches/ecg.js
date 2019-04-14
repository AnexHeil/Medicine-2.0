const express = require('express');
const router = express.Router();
const mongose = require('mongoose');
require('../../models/ECG');
const ECG = mongose.model('ecgResearches');
require('../../models/ECGCalcs');
const ECGCalcs = mongose.model('ecgCalcs');
require('../../models/Student');
const Student = mongose.model('students');
const { searchResearches, formGroups, formForStudent } = require('../../heplers/search');
const { ensureAuthenticated, ensureUser } = require('../../heplers/auth');
const { calculateECG } = require('../../heplers/calcs');
let searchParams;
router.get('/add', ensureAuthenticated, ensureUser, (req, res) => {
    res.render('researches/ecg/add');
});

router.get('/', ensureAuthenticated, (req, res) => {
    Student.find({})
        .then(students => {
            const groups = formGroups(students);
            ECG.find({})
                .populate('student')
                .then(researches => {
                    if (req.user.status == 'student') {
                        researches = formForStudent(req.user.username, researches);
                    }
                    if (searchParams) {
                        result = searchResearches(researches, searchParams);
                        searchParams = undefined;
                        res.render('researches/ecg/index', { researches: result, students: students, groups: groups, way: '/ecg', way2: '/ecg', way3: '/ecg' });
                    }
                    else {
                        res.render('researches/ecg/index', { researches: researches, students: students, groups: groups, way: '/ecg', way2: '/ecg', way3: '/ecg' });
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
    res.redirect('/ecg');
});

router.post('/', ensureAuthenticated, ensureUser, async (req, res) => {
    let errors = [];
    let newResearch = req.body.research;
    await Student.findOne({ studentNumber: req.body.studentNumber })
        .then(async function (student) {
            if (student) {
                let studentID = student._id;
                await ECG.findOne({ researchDate: newResearch.researchDate, student: studentID })
                    .then(research => {
                        if (research) {
                            errors.push({ text: 'Обследование этого студента в указанное время уже зарегестрированно.' });
                        }
                        else {
                            newResearch.student = studentID;
                            ECG.create(newResearch)
                                .then(research => {
                                    req.flash('Исследование успешно зарегестрированно.')
                                    res.redirect('/ecg');
                                });
                        }
                    })
                    .catch(err => {
                        console.log(err);
                        req.flash('error_msg', `Возникла критическая ошибка. Попробуйте повторить операцию позже.`);
                        res.redirect('/ecg');
                    })
            }
            else {
                errors.push({ text: 'Указанный студент не зарегестрирован.' });
            }
        })
        .catch(err => {
            console.log(err);
            req.flash('error_msg', `Возникла критическая ошибка. Попробуйте повторить операцию позже.`);
            res.redirect('/ecg');
        });
    if (errors.length > 0) {
        res.render('researches/ecg/add', {
            errors: errors,
            research: newResearch
        });
    }
});
router.get('/:id/edit', ensureAuthenticated, ensureUser, (req, res) => {
    ECG.findById(req.params.id)
        .populate('student')
        .then(research => {
            if (research) {
                res.render('researches/ecg/edit', { research: research });
            }
            else {
                req.flash('error_msg', `Исследование не найдено.`);
                res.redirect('/ecg');
            }
        })
        .catch(err => {
            req.flash('error_msg', `Возникла критическая ошибка. Попробуйте повторить операцию позже.`);
            res.redirect('/ecg');
        });
});
router.put('/:id', ensureAuthenticated, ensureUser, (req, res) => {
    ECG.findByIdAndUpdate(req.params.id, req.body.research, { new: true })
        .then(research => {
            ECGCalcs.findOne({ research: research._id })
                .then(calc => {
                    if (calc) {
                        let calcs = calculateECG(research);
                        ECGCalcs.findByIdAndUpdate(calc._id, calcs, { new: true })
                            .then(newCalc => {
                                req.flash('success_msg', 'Данные исследования успешно изменены.')
                                res.redirect('/ecg');
                            })
                    }
                })
        })
        .catch(err => {
            req.flash('error_msg', `Возникла критическая ошибка. Попробуйте повторить операцию позже.`);
            res.redirect('/ecg');
        });
});
router.delete('/:id', ensureAuthenticated, ensureUser, (req, res) => {
    ECG.findByIdAndDelete(req.params.id)
        .then(research => {
            req.flash('success_msg', `Обследование успешно удалено.`);
            res.redirect('/ecg');
        })
        .catch(err => {
            req.flash('error_msg', `Возникла критическая ошибка. Попробуйте повторить операцию позже.`);
            res.redirect('/ecg');
        });
});
module.exports = router;