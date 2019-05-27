module.exports = {
    ensureAuthenticated: function (req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        else {
            req.flash('error_msg', 'Пожалуйста, авторизируйтесь.');
            res.redirect('/users/login');
        }
    },
    ensureUser: function (req, res, next) {
        if (req.isAuthenticated && req.user.status !== 'student') {
            return next();
        }
        else {
            req.flash('error_msg', 'Пожалуйста, авторизируйтесь.')
            res.redirect('/users/login');
        }
    },
    ensureAdmin: function (req, res, next) {
        if (req.isAuthenticated) {
            if (req.user.status == 'admin')
                return next();
            else {
                req.flash('error_msg', 'Недостаточно прав.')
                res.redirect('/users/login');
            }
        }
        else {
            req.flash('error_msg', 'Пожалуйста, авторизируйтесь.')
            res.redirect('/users/login');
        }
    },
}