const express = require('express');
const router = express.Router();
const mongose = require('mongoose');
require('../../models/Physics');
const Physics = mongose.model('physicResearches');
require('../../models/Student');
const Student = mongose.model('students');
const { searchResearches, formGroups, formForStudent } = require('../../heplers/search');
const { ensureAuthenticated, ensureUser } = require('../../heplers/auth');
let searchParams;
router.get('/add', ensureAuthenticated, ensureUser, (req, res) => {
    res.render('researches/physics/add');
});

router.get('/', ensureAuthenticated, (req, res) => {
    Student.find({})
        .then(students => {
            const groups = formGroups(students);
            Physics.find({})
                .populate('student')
                .then(researches => {
                    if (req.user.status == 'student') {
                        researches = formForStudent(req.user.username, researches);
                    }
                    if (searchParams) {
                        result = searchResearches(researches, searchParams);
                        searchParams = undefined;
                        res.render('researches/physics/index', { researches: result, students: students, groups: groups, way: '/physics', way2: '/physics', way3: '/physics' });
                    }
                    else {
                        res.render('researches/physics/index', { researches: researches, students: students, groups: groups, way: '/physics', way2: '/physics', way3: '/physics' });
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
    res.redirect('/physics');
});

router.post('/', ensureAuthenticated, ensureUser, async (req, res) => {
    let errors = [];
    let newResearch = req.body.research;
    await Student.findOne({ studentNumber: req.body.studentNumber })
        .then(async function (student) {
            if (student) {
                let studentID = student._id;
                await Physics.findOne({ researchDate: newResearch.researchDate, student: studentID })
                    .then(research => {
                        if (research) {
                            errors.push({ text: 'Обследование этого студента в указанное время уже зарегестрированно.' });
                        }
                        else {
                            newResearch.student = studentID;
                            Physics.create(newResearch)
                                .then(research => {
                                    req.flash('Исследование успешно зарегестрированно.')
                                    res.redirect('/physics');
                                });
                        }
                    })
                    .catch(err => {
                        console.log(err);
                        req.flash('error_msg', `Возникла критическая ошибка. Попробуйте повторить операцию позже.`);
                        res.redirect('/physics');
                    })
            }
            else {
                errors.push({ text: 'Указанный студент не зарегестрирован.' });
            }
        })
        .catch(err => {
            console.log(err);
            req.flash('error_msg', `Возникла критическая ошибка. Попробуйте повторить операцию позже.`);
            res.redirect('/physics');
        });
    if (errors.length > 0) {
        res.render('researches/physics/add', { errors: errors, research: newResearch });
    }
});

router.get('/:id/edit', ensureAuthenticated, ensureUser, (req, res) => {
    Physics.findById(req.params.id)
        .populate('student')
        .then(research => {
            if (research) {
                res.render('researches/physics/edit', { research: research });
            }
            else {
                req.flash('error_msg', `Исследование не найдено.`);
                res.redirect('/physics');
            }
        })
        .catch(err => {
            req.flash('error_msg', `Возникла критическая ошибка. Попробуйте повторить операцию позже.`);
            res.redirect('/physics');
        });
});
router.put('/:id', ensureAuthenticated, ensureUser, (req, res) => {
    Physics.findByIdAndUpdate(req.params.id, req.body.research)
        .then(research => {
            req.flash('success_msg', 'Данные исследования успешно изменены.')
            res.redirect('/pr');
        })
    .catch(err => {
        req.flash('error_msg', `Возникла критическая ошибка. Попробуйте повторить операцию позже.`);
        res.redirect('/physics');
    });
});
router.delete('/:id', ensureAuthenticated, ensureUser, (req, res) => {
    Physics.findByIdAndDelete(req.params.id)
        .then(research => {
            req.flash('success_msg', `Обследование успешно удалено.`);
            res.redirect('/physics');
        })
        .catch(err => {
            req.flash('error_msg', `Возникла критическая ошибка. Попробуйте повторить операцию позже.`);
            res.redirect('/physics');
        });
})
module.exports = router;