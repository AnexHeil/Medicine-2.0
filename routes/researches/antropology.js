const express = require('express');
const router = express.Router();
const mongose = require('mongoose');
require('../../models/Antropology');
const Antropology = mongose.model('antropologyResearches');
require('../../models/Student');
const Student = mongose.model('students');

const { ensureAuthenticated } = require('../../heplers/auth');

router.get('/add', ensureAuthenticated, (req, res) => {
    res.render('researches/antropology/add');
});

router.get('/', (req, res)=>{
    Antropology.find({})
        .populate('student')
        .then(researches =>{
            res.render('researches/antropology/index', {researches: researches});
        })
        .catch(err => {
            console.log(err);
            req.flash('error_msg', `Возникла критическая ошибка. Попробуйте повторить операцию позже.`);
            res.redirect('/');
        })
});

router.post('/', ensureAuthenticated, async (req, res) => {
    let errors = [];
    await Student.findOne({ studentNumber: req.body.studentNumber })
        .then(async function(student){
            if (student) {
                let studentID = student._id;
                await Antropology.findOne({ researchDate: req.body.researchDate, studentID: studentID })
                    .then(research => {
                        if (research) {
                            errors.push({ text: 'Обследование этого студента в указанное время уже зарегестрированно.' });
                        }
                        else {
                            Antropology.create({
                                student: studentID,
                                stayHeight: req.body.stayHeight,
                                sitHeight: req.body.sitHeight,
                                handWidth: req.body.handWidth,
                                weight: req.body.weight,
                                chestOnBreath: req.body.chestOnBreath,
                                chestOnFullBreath: req.body.chestOnFullBreath,
                                chestOnMaxBreath: req.body.chestOnMaxBreath,
                                researchDate: req.body.researchDate
                            }).then(research => {
                                req.flash('Исследование успешно зарегестрированно.')
                                res.redirect('/antropology');
                            });
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
            stayHeight: req.body.stayHeight,
            sitHeight: req.body.sitHeight,
            handWidth: req.body.handWidth,
            weight: req.body.weight,
            chestOnBreath: req.body.chestOnBreath,
            chestOnFullBreath: req.body.chestOnFullBreath,
            chestOnMaxBreath: req.body.chestOnMaxBreath,
            researchDate: req.body.researchDate
        });
    }
});
module.exports = router;