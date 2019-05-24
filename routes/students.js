const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { ensureAuthenticated, ensureUser } = require('../heplers/auth');
require('../models/Student');
require('../models/User');
const Student = mongoose.model('students');
const User = mongoose.model('users');
const Excel = require('exceljs');
const XLSX = require('xlsx');
const Path = require('path');

router.get('/', ensureAuthenticated, ensureUser, (req, res) => {
    Student.find()
        .then(students => {
            res.render('students/index', { students: students });
        })
        .catch(err => {
            req.flash('error_msg', `Возникла критическая ошибка. Попробуйте повторить операцию позже.`);
            res.redirect('/students');
        });
});


router.get('/add', ensureAuthenticated, ensureUser, (req, res) => {
    res.render('students/add');
});

router.post('/', ensureAuthenticated, ensureUser, async (req, res) => {
    let errors = [];
    if (req.body.student.group.length < 4) {
        errors.push({ text: 'Номер группы должен быть не короче 4-х символов.' });
    }
    const birthDate = new Date(req.body.student.birthDate);
    if (birthDate.getYear() > 2004) {
        errors.push({ text: 'Указана неверная дата рождения.' });
    }
    await Student.findOne({ studentNumber: req.body.student.studentNumber })
        .then(student => {
            if (student) {
                errors.push({ text: 'Указанный студент уже зарегестрирован. Пожалуйста, проверьте правильность номера студ. билета.' });
            }
        });
    if (errors.length > 0) {
        console.log(errors);
        res.render('students/add', {
            errors: errors,
            student: req.body.student
        });
    }
    else {
        Student.create(req.body.student)
            .then(student => {
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(student.studentNumber, salt, (err, hash) => {
                        if (err) {
                            console.log(err);
                        }
                        else {
                            const password = hash;
                            User.create({
                                username: student.studentNumber,
                                firstName: student.firstName,
                                lastName: student.lastName,
                                password: password,
                                status: 'student'
                            })
                                .then(student => {
                                    req.flash('success_msg', `Студент № ${req.body.student.studentNumber} успешно зарегестрирован.`);
                                    res.redirect('/students');
                                })
                                .catch(err => {
                                    req.flash('error_msg', `Возникла критическая ошибка. Попробуйте повторить операцию позже.`);
                                    res.redirect('/students');
                                });
                        }
                    });
                })
            })
            .catch(err => {
                req.flash('error_msg', `Возникла критическая ошибка. Попробуйте повторить операцию позже.`);
                res.redirect('/students');
            });
    }
});


router.get('/:id/edit', ensureAuthenticated, ensureUser, (req, res) => {
    Student.findById(req.params.id)
        .then(student => {
            if (student) {
                res.render('students/edit', { student: student });
            }
            else {
                req.flash('error_msg', `Студент не найден.`);
                res.redirect('/students');
            }
        })
        .catch(err => {
            req.flash('error_msg', `Возникла критическая ошибка. Попробуйте повторить операцию позже.`);
            res.redirect('/students');
        });
});

router.put('/:id', ensureAuthenticated, ensureUser, (req, res) => {
    Student.findByIdAndUpdate(req.params.id, req.body.student)
        .then(student => {
            req.flash('success_msg', `Данные студента № ${student.studentNumber} успешно изменены.`);
            res.redirect('/students');
        })
        .catch(err => {
            req.flash('error_msg', `Возникла критическая ошибка. Попробуйте повторить операцию позже.`);
            res.redirect('/students');
        });
});
router.get('/import', ensureAuthenticated, (req, res) => {
    res.render('students/import');
});
router.post('/import', ensureAuthenticated, (req, res) => {
    // let workbook = new Excel.Workbook();
    let filepath = Path.resolve('D:/Materials/', req.body.file);
    // workbook.xlsx.readFile(filepath)
    //     .then('')
    let workbook = XLSX.readFile(filepath);
    let students = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
    let data = [];
    let arr;
    for (let i = 0; i < students.length; i++) {
        arr = students[i][Object.keys(students[i])[0]].split(/ /g);
        date = XLSX.SSF.parse_date_code(students[i][Object.keys(students[i])[5]]);
        let compDate = new Date(`${date.y}-${date.m}-${date.d}`);
        data.push({
            studentNumber: students[i][Object.keys(students[i])[1]],
            firstName: arr[1],
            lastName: arr[0],
            patronymic: arr[2],
            group: students[i][Object.keys(students[i])[3]],
            birthDate: compDate,
            sex: students[i][Object.keys(students[i])[4]]
        });
    };
    Student.find({}).
        then((registeredStudents) => {
            for (let i = 0; i < registeredStudents.length; i++) {
                for (let j = 0; j < data.length; j++) {
                    let one = " " + registeredStudents[i].studentNumber
                    let two = " " + data[j].studentNumber
                    if (one == two) {
                        data.splice(j, 1);
                    }
                }
            };
            if (data[0] != undefined) {
                Student.collection.insertMany(data)
                    .then(students => {
                        req.flash('msg_success', 'Импорт списка студентов успешно завершён.')
                        res.redirect('/students');
                    })
                    .catch(err => {
                        req.flash('error_msg', `Возникла критическая ошибка. Попробуйте повторить операцию позже.`);
                        res.redirect('/students');
                    });
            }
            else
                req.flash('msg_success', 'Импорт списка студентов успешно завершён.')
                res.redirect('/students');
        });
});

router.delete('/:id', ensureAuthenticated, ensureUser, (req, res) => {
    Student.findByIdAndDelete(req.params.id)
        .then(student => {
            req.flash('success_msg', `Данные студента № ${student.studentNumber} успешно удалены.`);
            res.redirect('/students');
        })
        .catch(err => {
            req.flash('error_msg', `Возникла критическая ошибка. Попробуйте повторить операцию позже.`);
            res.redirect('/students');
        });
});

module.exports = router;