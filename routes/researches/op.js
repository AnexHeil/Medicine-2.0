const express = require('express');
const router = express.Router();
const mongose = require('mongoose');
require('../../models/OP');
const OP = mongose.model('opResearches');
require('../../models/Student');
const Student = mongose.model('students');
require('../../models/Antropology');
const Antropology = mongose.model('antropologyResearches');
const { calculateOP } = require('../../heplers/calcs');
const { searchResearches, formGroups, formForStudent } = require('../../heplers/search');
const { ensureAuthenticated, ensureUser } = require('../../heplers/auth');
require('../../models/OPCalcs');
const OPCalcs = mongose.model('opCalcs');
let searchParams;
router.get('/add', ensureAuthenticated, ensureUser, (req, res) => {
    res.render('researches/op/add');
});

router.get('/', ensureAuthenticated, (req, res) => {
    Student.find({})
        .then(students => {
            const groups = formGroups(students);
            OP.find({})
                .populate('student')
                .then(researches => {
                    if (req.user.status == 'student') {
                        researches = formForStudent(req.user.username, researches);
                    }
                    if (searchParams) {
                        result = searchResearches(researches, searchParams);
                        searchParams = undefined;
                        res.render('researches/op/index', { researches: result, students: students, groups: groups, way: '/op', way2: '/op', way3: '/op' });
                    }
                    else {
                        res.render('researches/op/index', { researches: researches, students: students, groups: groups, way: '/op', way2: '/op', way3: '/op' });
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
    res.redirect('/op');
});

router.post('/', ensureAuthenticated, ensureUser, async (req, res) => {
    let errors = [];
    let newResearch = req.body.research;
    await Student.findOne({ studentNumber: req.body.studentNumber })
        .then(async function (student) {
            if (student) {
                let studentID = student._id;
                await OP.findOne({ researchDate: newResearch.researchDate, student: studentID })
                    .then(research => {
                        if (research) {
                            errors.push({ text: 'Обследование этого студента в указанное время уже зарегестрированно.' });
                        }
                        else {
                            newResearch.student = studentID;
                            OP.create(newResearch)
                                .then(research => {
                                    req.flash('Исследование успешно зарегестрированно.')
                                    res.redirect('/op');
                                });
                        }
                    })
                    .catch(err => {
                        console.log(err);
                        req.flash('error_msg', `Возникла критическая ошибка. Попробуйте повторить операцию позже.`);
                        res.redirect('/op');
                    })
            }
            else {
                errors.push({ text: 'Указанный студент не зарегестрирован.' });
            }
        })
        .catch(err => {
            console.log(err);
            req.flash('error_msg', `Возникла критическая ошибка. Попробуйте повторить операцию позже.`);
            res.redirect('/op');
        });
    if (errors.length > 0) {
        res.render('researches/op/add', { errors: errors, research: newResearch });
    }
});
router.get('/:id/edit', ensureAuthenticated, ensureUser, (req, res) => {
    OP.findById(req.params.id)
        .populate('student')
        .then(research => {
            if (research) {
                res.render('researches/op/edit', { research: research });
            }
            else {
                req.flash('error_msg', `Исследование не найдено.`);
                res.redirect('/op');
            }
        })
        .catch(err => {
            req.flash('error_msg', `Возникла критическая ошибка. Попробуйте повторить операцию позже.`);
            res.redirect('/op');
        });
});
router.put('/:id', ensureAuthenticated, ensureUser, (req, res) => {
    OP.findByIdAndUpdate(req.params.id, req.body.research, { new: true })
        .populate('student')
        .then(research => {
            OPCalcs.findOne({ research: research._id })
                .then(opcalcs => {
                    console.log(opcalcs);
                    if (opcalcs) {
                        Antropology.findOne({ student: research.student._id, researchDate: research.researchDate })
                            .then(antropology => {
                                if (antropology) {
                                    let calcs = calculateOP(research, research.student, antropology);
                                    OPCalcs.findOneAndUpdate({ research: research._id }, calcs, { new: true })
                                        .then(calc => {
                                            req.flash('success_msg', 'Данные исследования успешно изменены.')
                                            res.redirect('/op');
                                        });
                                }
                                else {
                                    req.flash('success_msg', 'Данные исследования успешно изменены.')
                                    res.redirect('/op');
                                }
                            })
                    }
                    else {
                        req.flash('success_msg', 'Данные исследования успешно изменены.')
                        res.redirect('/op');
                    }
                })
        })
        .catch(err => {
            req.flash('error_msg', `Возникла критическая ошибка. Попробуйте повторить операцию позже.`);
            res.redirect('/op');
        });
});
router.delete('/:id', ensureAuthenticated, ensureUser, (req, res) => {
    OP.findByIdAndDelete(req.params.id)
        .then(research => {
            req.flash('success_msg', `Обследование успешно удалено.`);
            res.redirect('/op');
        })
        .catch(err => {
            req.flash('error_msg', `Возникла критическая ошибка. Попробуйте повторить операцию позже.`);
            res.redirect('/op');
        });
})
module.exports = router;