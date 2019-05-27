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
require('./models/Physics');
const users = require('./routes/users');
const students = require('./routes/students');
const antropology = require('./routes/researches/antropology');
const morphology = require('./routes/researches/morphology');
const ecg = require('./routes/researches/ecg');
const spyro = require('./routes/researches/spyro');
const op = require('./routes/researches/op');
const shg = require('./routes/researches/shg');
const pr = require('./routes/researches/pr');
const physic = require('./routes/researches/physics');
const antrmorphCalcs = require('./routes/analysis/antrmorph');
const prCacls = require('./routes/analysis/pr');
const shgCacls = require('./routes/analysis/shg');
const opCacls = require('./routes/analysis/op');
const spyroCacls = require('./routes/analysis/spyro');
const ecgCalcs = require('./routes/analysis/ecg');
const importion = require('./routes/researches/import');
require('./config/passport')(passport);

const {
    formatDate,
    checkSex,
    checkStatus,
    createHeader,
    selectResearch,
    reportTable,
    ifphysics
} = require('./heplers/hbs');
mongoose.connect('mongodb://Heil:135928a@ds163835.mlab.com:63835/medicine-dev', { useNewUrlParser: true })
    .then(() => {
        console.log('MongoDB connected');
    })
    .catch((err) => console.log(err));;

app.engine('handlebars', exhbs({helpers: {
    formatDate: formatDate,
    checkSex: checkSex,
    checkStatus: checkStatus,
    createHeader: createHeader,
    selectResearch, selectResearch,
    reportTable: reportTable,
    ifphysics: ifphysics
},  defaultLayout: 'main'}));
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
app.use('/physics', physic);
app.use('/analysis/antrmorph', antrmorphCalcs);
app.use('/analysis/pr', prCacls);
app.use('/analysis/shg', shgCacls);
app.use('/analysis/op', opCacls);
app.use('/analysis/spyro', spyroCacls);
app.use('/analysis/ecg', ecgCalcs);
app.use('/import', importion);


const port = process.env.port || 3000;
app.listen(port, () => {
    console.log('Server started at port' + port + '!');
});