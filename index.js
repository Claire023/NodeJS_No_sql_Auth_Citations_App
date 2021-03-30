const express = require('express');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const mongoose = require('mongoose');
const ExpressError = require('./utils/ExpressError');
const passport = require('passport');
const flash = require('connect-flash');
const LocalStrategy = require('passport-local');
const User =  require('./models/user');
const userRoutes = require('./routes/users');
const quoteRoutes = require('./routes/quotes');
const {isLoggedIn} = require('./middleware');


mongoose.connect('mongodb://localhost:27017/quotes',{
    useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology:true,
    useFindAndModify:false
});



const db = mongoose.connection;
db.on("error", console.error.bind(console, "connexion error:"));
db.once("open", ()=>{
    console.log("database connected");
});

const app = express();

//pour parser les templates
app.engine('ejs', ejsMate);

app.set('view engine', 'ejs');
app.set('views',path.join(__dirname,'views'))

app.use(express.urlencoded({extended:true}));
app.use(express.json());

//pour les sessions
const sessionConfig = {
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}


app.use(session(sessionConfig));
//pour les messages d'erreur
app.use(flash());
//utiliser les put dans formulaire
app.use(methodOverride('_method'));


//Authentication
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})


//declaration des routes
app.use('/', userRoutes);
app.use('/quotes', quoteRoutes);
// app.use('/search', searchRoutes);



app.listen(3000, ()=>{
    console.log('Serveur running on port 3000');
})