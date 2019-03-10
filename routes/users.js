const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');
require('../models/User');
const User = mongoose.model('users');

router.get('/login', (req, res) => {
    res.render('login');
});

router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});



router.get('/register', (req, res) => {
    res.render('register');
});

router.post('/register', (req, res) => {
    let errors = [];
    if (req.body.password.length < 4) {
        errors.push({ text: 'Пароль должены бытьне короче 4-х символов' });
    }
    if (req.body.password2 != req.body.password) {
        errors.push({ text: 'Пароли не совпадают' });
    }
    if (errors.length > 0) {
        res.render('register', {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            username: req.body.username,
            errors: errors
        });
    }
    else {
        let newPassword
        User.findOne({ username: req.body.username })
            .then(user => {
                if (user) {
                    errors.push({ text: 'Такой ползьователь уже существует.' });
                    res.render('register', {
                        firstName: req.body.firstName,
                        lastName: req.body.lastName,
                        username: req.body.username,
                        errors: errors
                    });
                }
                else {
                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(req.body.password, salt, function (err, hash) {
                            if (err) {
                                throw err;
                            }
                            else {
                                newPassword = hash;
                                User.create({
                                    username: req.body.username,
                                    firstName: req.body.firstName,
                                    lastName: req.body.lastName,
                                    password: newPassword,
                                    status: 'regular'
                                })
                                    .then(user => {
                                        req.flash('success_msg', `Регистрация успешна. Добро пожаловать, ${user.firstName} ${user.lastName}`);
                                        req.session.save(function () {
                                            res.redirect('/');
                                        })
                                    });
                            }
                        })
                    });

                }
            });
    }
});
module.exports = router;