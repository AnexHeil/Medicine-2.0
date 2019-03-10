const express = require('express');
const exhbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const app = express();


const users = require('./routes/users');
require('./config/passport')(passport);

mongoose.connect('mongodb://Heil:135928a@ds163835.mlab.com:63835/medicine-dev', { useNewUrlParser: true })
    .then(() => {
        console.log('MongoDB connected');
    })
    .catch((err) => console.log(err));;

app.engine('handlebars', exhbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());



app.use(function(req, res, next){
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});
app.get('/', (req, res) => {
    res.render('landing');
})

app.use('/users', users);
const port = process.env.port || 3000;
app.listen(port, () => {
    console.log('Server started at ' + port + '!');
});