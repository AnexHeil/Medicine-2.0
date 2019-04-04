const express = require('express');
const router = express.Router();
const mongose = require('mongoose');
require('../../models/PR');
const PR = mongose.model('prResearches');
require('../../models/Student');
const Student = mongose.model('students');
const { searchResearches, formGroups, formForStudent } = require('../../heplers/search');
const { ensureAuthenticated, ensureUser } = require('../../heplers/auth');
let searchParams;
router.get('/add', ensureAuthenticated, ensureUser, (req, res) => {
    res.render('researches/pr/add');
});

router.get('/', ensureAuthenticated, (req, res) => {
    Student.find({})
        .then(students => {
            const groups = formGroups(students);
            PR.find({})
                .populate('student')
                .then(researches => {
                    if (req.user.status == 'student') {
                        researches = formForStudent(req.user.username, researches);
                    }
                    if (searchParams) {
                        result = searchResearches(researches, searchParams);
                        searchParams = undefined;
                        res.render('researches/pr/index', { researches: result, students: students, groups: groups, way: '/pr' });
                    }
                    else {
                        res.render('researches/pr/index', { researches: researches, students: students, groups: groups, way: '/pr' });
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
    res.redirect('/pr');
});

router.post('/', ensureAuthenticated, ensureUser, async (req, res) => {
    let errors = [];
    let newResearch = req.body.research;
    await Student.findOne({ studentNumber: req.body.studentNumber })
        .then(async function (student) {
            if (student) {
                let studentID = student._id;
                await PR.findOne({ researchDate: newResearch.researchDate, student: studentID })
                    .then(research => {
                        if (research) {
                            errors.push({ text: 'Обследование этого студента в указанное время уже зарегестрированно.' });
                        }
                        else {
                            newResearch.student = studentID;
                            PR.create(newResearch)
                                .then(research => {
                                    req.flash('Исследование успешно зарегестрированно.')
                                    res.redirect('/pr');
                                });
                        }
                    })
                    .catch(err => {
                        console.log(err);
                        req.flash('error_msg', `Возникла критическая ошибка. Попробуйте повторить операцию позже.`);
                        res.redirect('/pr');
                    })
            }
            else {
                errors.push({ text: 'Указанный студент не зарегестрирован.' });
            }
        })
        .catch(err => {
            console.log(err);
            req.flash('error_msg', `Возникла критическая ошибка. Попробуйте повторить операцию позже.`);
            res.redirect('/pr');
        });
    if (errors.length > 0) {
        res.render('researches/pr/add', {errors: errors, research: newResearch });
    }
});
router.get('/:id/edit', ensureAuthenticated, ensureUser, (req, res) => {
    PR.findById(req.params.id)
        .populate('student')
        .then(research => {
            if (research) {
                res.render('researches/pr/edit', { research: research });
            }
            else {
                req.flash('error_msg', `Исследование не найдено.`);
                res.redirect('/pr');
            }
        })
        .catch(err => {
            req.flash('error_msg', `Возникла критическая ошибка. Попробуйте повторить операцию позже.`);
            res.redirect('/pr');
        });
});
router.put('/:id', ensureAuthenticated, ensureUser, (req, res) => {
    PR.findByIdAndUpdate(req.params.id, req.body.research)
        .then(research => {
            req.flash('success_msg', 'Данные исследования успешно изменены.')
            res.redirect('/pr');
        })
        .catch(err => {
            req.flash('error_msg', `Возникла критическая ошибка. Попробуйте повторить операцию позже.`);
            res.redirect('/pr');
        });
});
router.delete('/:id', ensureAuthenticated, ensureUser, (req, res) => {
    PR.findByIdAndDelete(req.params.id)
        .then(research => {
            req.flash('success_msg', `Обследование успешно удалено.`);
            res.redirect('/pr');
        })
        .catch(err => {
            req.flash('error_msg', `Возникла критическая ошибка. Попробуйте повторить операцию позже.`);
            res.redirect('/pr');
        });
})
module.exports = router;