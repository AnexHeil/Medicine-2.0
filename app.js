const express = require('express');
const exhbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const methodOverride = require('method-override');
const app = express();

require('./models/User');
require('./models/Student');
require('./models/Antropology');
require('./models/Morphology');
require('./models/ECG');
require('./models/Spyro');
require('./models/OP');
require('./models/PR');
require('./models/ShG');
const users = require('./routes/users');
const students = require('./routes/students');
const antropology = require('./routes/researches/antropology');
const morphology = require('./routes/researches/morphology');
const ecg = require('./routes/researches/ecg');
const spyro = require('./routes/researches/spyro');
const op = require('./routes/researches/op');
const shg = require('./routes/researches/shg');
const pr = require('./routes/researches/pr');
require('./config/passport')(passport);

const {
    formatDate,
    checkSex
} = require('./heplers/hbs');
mongoose.connect('mongodb://Heil:135928a@ds163835.mlab.com:63835/medicine-dev', { useNewUrlParser: true })
    .then(() => {
        console.log('MongoDB connected');
    })
    .catch((err) => console.log(err));;

app.engine('handlebars', exhbs({ defaultLayout: 'main', helpers: {
    formatDate: formatDate,
    checkSex: checkSex
}}));
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

app.use(methodOverride('_method'));

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
app.use('/students', students);

//research routes
app.use('/antropology', antropology);
app.use('/morphology', morphology);
app.use('/ecg', ecg);
app.use('/spyro', spyro);
app.use('/shg', shg);
app.use('/op', op);
app.use('/pr', pr);


const port = process.env.port || 3000;
app.listen(port, () => {
    console.log('Server started at port' + port + '!');
});