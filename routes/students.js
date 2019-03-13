const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
require('../models/Student');
const Student = mongoose.model('students');

router.get('/', (req, res) => {
    Student.find()
        .then(students => {
            res.render('students/index', {students: students});
        })
        .catch(err => {
            req.flash('error_msg', `Возникла критическая ошибка. Попробуйте повторить операцию позже.`);
            res.redirect('/students');
        });
});


router.get('/add', (req, res) => {
    res.render('students/add');
});

router.post('/', async (req, res) => {
    let errors = [];
    if (req.body.group.length < 4) {
        errors.push({ text: 'Номер группы должен быть не короче 4-х символов.' });
    }
    const birthDate = new Date(req.body.birthDate);
    if (birthDate.getYear() > 2004) {
        errors.push({ text: 'Указана неверная дата рождения.' });
    }
    await Student.findOne({ studentNumber: req.body.studentNumber })
        .then(student => {
            if (student) {
                errors.push({ text: 'Указанный студент уже зарегестрирован. Пожалуйста, проверьте правильность номера студ. билета' });
            }
        });
    if (errors.length > 0) {
        console.log(errors);
        res.render('students/add', {
            errors: errors,
            studentNumber: req.body.studentNumber,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            patronymic: req.body.patronymic,
            group: req.body.group
        });
    }
    else {
        Student.create({
            studentNumber: req.body.studentNumber,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            patronymic: req.body.patronymic,
            group: req.body.group,
            birthDate: req.body.birthDate,
            sex: req.body.sex
        })
            .then(student => {
                req.flash('success_msg', `Студент № ${req.body.studentNumber} успешно зарегестрирован`);
                res.redirect('/students');
            })
            .catch(err => {
                req.flash('error_msg', `Возникла критическая ошибка. Попробуйте повторить операцию позже.`);
                res.redirect('/students');
            });
    }
});

module.exports = router;