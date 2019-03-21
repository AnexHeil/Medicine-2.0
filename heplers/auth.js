module.exports = {
    ensureAuthenticated: function(req, res, next){
        if(req.isAuthenticated()){
            return next();
        }
        else{
            req.flash('error_msg', 'Пожалуйста, авторизируйтесь.');
            res.redirect('/users/login');
        }
    }
}