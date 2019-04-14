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
const { searchResearches, formGroups, formForStudent } = require('../../heplers/search');
const { ensureAuthenticated, ensureUser } = require('../../heplers/auth');
const { calculateAntrMorphData } = require('../../heplers/calcs');
let searchParams;
router.get('/add', ensureAuthenticated, ensureUser, (req, res) => {
    res.render('researches/antropology/add');
});

router.get('/', ensureAuthenticated, (req, res) => {
    Student.find({})
        .then(students => {
            const groups = formGroups(students);
            Antropology.find({})
                .populate('student')
                .then(researches => {
                    if (req.user.status == 'student') {
                        researches = formForStudent(req.user.username, researches);
                    }
                    if (searchParams) {
                        result = searchResearches(researches, searchParams);
                        searchParams = undefined;
                        res.render('researches/antropology/index', { researches: result, students: students, groups: groups, way: '/antropology', way2: '/antrmorph', way3: '/antroplogy' });
                    }
                    else {
                        res.render('researches/antropology/index', { researches: researches, students: students, groups: groups, way: '/antropology', way2: '/antrmorph', way3: '/antroplogy' });
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
    res.redirect('/antropology');
})

router.post('/', ensureAuthenticated, ensureUser, async (req, res) => {
    let errors = [];
    let newResearch = req.body.research;
    await Student.findOne({ studentNumber: req.body.studentNumber })
        .then(async function (student) {
            if (student) {
                let studentID = student._id;
                await Antropology.findOne({ researchDate: newResearch.researchDate, student: studentID })
                    .then(research => {
                        if (research) {
                            errors.push({ text: 'Обследование этого студента в указанное время уже зарегестрированно.' });
                        }
                        else {
                            newResearch.student = studentID;
                            Antropology.create(newResearch)
                                .then(research => {
                                    req.flash('success_msg', 'Исследование успешно зарегестрированно.')
                                    res.redirect('/antropology');
                                })
                                .catch(err => {
                                    console.log(err);
                                    req.flash('error_msg', `Возникла критическая ошибка. Попробуйте повторить операцию позже.`);
                                    res.redirect('/antropology');
                                })
                        }
                    })
                    .catch(err => {
                        console.log(err);
                        req.flash('error_msg', `Возникла критическая ошибка. Попробуйте повторить операцию позже.`);
                        res.redirect('/antropology');
                    })
            }
            else {
                errors.push({ text: 'Указанный студент не зарегестрирован.' });
            }
        })
        .catch(err => {
            console.log(err);
            req.flash('error_msg', `Возникла критическая ошибка. Попробуйте повторить операцию позже.`);
            res.redirect('/antropology');
        });
    if (errors.length > 0) {
        res.render('researches/antropology/add', {
            errors: errors,
            research: newResearch
        });
    }
});
router.get('/:id/edit', ensureAuthenticated, ensureUser, (req, res) => {
    Antropology.findById(req.params.id)
        .populate('student')
        .then(research => {
            if (research) {
                res.render('researches/antropology/edit', { research: research });
            }
            else {
                req.flash('error_msg', `Исследование не найдено.`);
                res.redirect('/antropology');
            }
        })
        .catch(err => {
            req.flash('error_msg', `Возникла критическая ошибка. Попробуйте повторить операцию позже.`);
            res.redirect('/antropology');
        });
});
router.put('/:id', ensureAuthenticated, ensureUser, (req, res) => {
    Antropology.findByIdAndUpdate(req.params.id, req.body.research, { new: true })
        .then(antropology => {
            AntrMorphCalc.findOne({ research: antropology._id })
                .then(data => {
                    if (data) {
                        Morphology.findOne({ student: antropology.student, researchDate: antropology.researchDate })
                            .then(morphology => {
                                if (morphology) {
                                    let analysis = calculateAntrMorphData(antropology, morphology);
                                    AntrMorphCalc.findByIdAndUpdate(data._id, analysis)
                                        .then(newCalc => {
                                            req.flash('success_msg', 'Данные исследования успешно изменены.')
                                            res.redirect('/antropology');
                                        })
                                }
                            });
                    }
                });
        })
        .catch(err => {
            req.flash('error_msg', `Возникла критическая ошибка. Попробуйте повторить операцию позже.`);
            res.redirect('/antropology');
        });
});
router.delete('/:id', ensureAuthenticated, ensureUser, (req, res) => {
    Antropology.findByIdAndDelete(req.params.id)
        .then(research => {
            req.flash('success_msg', `Обследование успешно удалено.`);
            res.redirect('/antropology');
        })
        .catch(err => {
            req.flash('error_msg', `Возникла критическая ошибка. Попробуйте повторить операцию позже.`);
            res.redirect('/antropology');
        });
});


//Calculations and analysis performing



module.exports = router;