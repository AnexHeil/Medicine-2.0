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
    res.render('researches/morphology/add');
});

router.get('/', ensureAuthenticated, (req, res) => {
    Student.find({})
        .then(students => {
            const groups = formGroups(students);
            Morphology.find({})
                .populate('student')
                .then(researches => {
                    if (req.user.status == 'student') {
                        researches = formForStudent(req.user.username, researches);
                    }
                    if (searchParams) {
                        result = searchResearches(researches, searchParams);
                        searchParams = undefined;
                        res.render('researches/morphology/index', { researches: result, students: students, groups: groups, way: '/morphology', way2: '/antrmorph', way3: '/morphology' });
                    }
                    else {
                        res.render('researches/morphology/index', { researches: researches, students: students, groups: groups, way: '/morphology', way2: '/antrmorph', way3: '/morphology' });
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
    res.redirect('/morphology');
});

router.post('/', ensureAuthenticated, ensureUser, async (req, res) => {
    let errors = [];
    let newResearch = req.body.research;
    await Student.findOne({ studentNumber: req.body.studentNumber })
        .then(async function (student) {
            if (student) {
                let studentID = student._id;
                await Morphology.findOne({ researchDate: newResearch.researchDate, student: studentID })
                    .then(research => {
                        if (research) {
                            errors.push({ text: 'Обследование этого студента в указанное время уже зарегестрированно.' });
                        }
                        else {
                            newResearch.student = studentID;
                            Morphology.create(newResearch)
                                .then(research => {
                                    req.flash('Исследование успешно зарегестрированно.')
                                    res.redirect('/morphology');
                                });
                        }
                    })
                    .catch(err => {
                        console.log(err);
                        req.flash('error_msg', `Возникла критическая ошибка. Попробуйте повторить операцию позже.`);
                        res.redirect('/morphology');
                    })
            }
            else {
                errors.push({ text: 'Указанный студент не зарегестрирован.' });
            }
        })
        .catch(err => {
            console.log(err);
            req.flash('error_msg', `Возникла критическая ошибка. Попробуйте повторить операцию позже.`);
            res.redirect('/morphology');
        });
    if (errors.length > 0) {
        res.render('researches/morphology/add', { errors: errors, research: newResearch });
    }
});
router.get('/:id/edit', ensureAuthenticated, ensureUser, (req, res) => {
    Morphology.findById(req.params.id)
        .populate('student')
        .then(research => {
            if (research) {
                res.render('researches/morphology/edit', { research: research });
            }
            else {
                req.flash('error_msg', `Исследование не найдено.`);
                res.redirect('/morphology');
            }
        })
        .catch(err => {
            req.flash('error_msg', `Возникла критическая ошибка. Попробуйте повторить операцию позже.`);
            res.redirect('/morphology');
        });
});
router.put('/:id', ensureAuthenticated, ensureUser, (req, res) => {
    Morphology.findByIdAndUpdate(req.params.id, req.body.research, { new: true })
        .then(morphology => {
            Antropology.findOne({ researchDate: morphology.researchDate, student: morphology.student })
                .then(antropology => {
                    if (antropology) {
                        AntrMorphCalc.findOne({ research: antropology._id })
                            .then(data => {
                                if (data) {
                                    let analysis = calculateAntrMorphData(antropology, morphology);
                                    AntrMorphCalc.findByIdAndUpdate(data._id, analysis)
                                        .then(newCalcs => {
                                            req.flash('success_msg', 'Данные исследования успешно изменены.')
                                            res.redirect('/morphology');
                                        })
                                }
                            })
                    }
                })
        })
        .catch(err => {
            req.flash('error_msg', `Возникла критическая ошибка. Попробуйте повторить операцию позже.`);
            res.redirect('/morphology');
        });

});
router.delete('/:id', ensureAuthenticated, ensureUser, (req, res) => {
    Morphology.findByIdAndDelete(req.params.id)
        .then(research => {
            req.flash('success_msg', `Обследование успешно удалено.`);
            res.redirect('/morphology');
        })
        .catch(err => {
            req.flash('error_msg', `Возникла критическая ошибка. Попробуйте повторить операцию позже.`);
            res.redirect('/morphology');
        });
})
module.exports = router;