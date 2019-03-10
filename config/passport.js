const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
require('../models/User');
const User = mongoose.model('users');
const bcrypt = require('bcryptjs');

module.exports = function (passport) {
    passport.use(new LocalStrategy(function (username, password, done) {
        User.findOne({ username: username })
            .then(user => {
                if (!user) {
                    return done(null, false, { message: 'Пользователь не найден. Неверно указаны имя или пароль' });
                }
                else {
                    bcrypt.compare(password, user.password, (err, isMatch) => {
                        if (err) {
                            return done(null, false, { message: 'Возникла ошибка при авторизации. Попробуйте позже.' })
                        }
                        if (!isMatch) {
                            return done(null, false, { message: 'Пароль указан неверно.' });
                        }
                        else {
                            return done(null, user);
                        }
                    });
                }
            });
    }));
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });
      
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
   });
}