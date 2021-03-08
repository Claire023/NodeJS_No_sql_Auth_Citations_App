const express = require('express');
const router = express.Router();
const User = require('../models/user');
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');


router.get('/register', (req,res)=>{
    res.render('users/register');
});


router.post('/register', catchAsync(async (req,res, next)=>{
    try{
        const {email,username, password} = req.body;
        const user = new User({email,username});
        const registeredUser = await User.register(user, password);
        req.login(registeredUser,err=>{
            if(err) return next(err);
            req.flash('success','Bienvenue sur Citations !');
            res.redirect('/quotes');
        })
    }catch (e){
        req.flash('error', e.message);
        res.redirect('register');
    }
}));


router.get('/login', (req,res)=>{
    res.render('users/login');
});


router.post('/login', passport.authenticate('local',{failureFlash :true, failureRedirect:'/login'}), (req,res)=>{
    res.redirect('/quotes');
});


router.get('/logout', (req,res)=>{
    req.logout();
    req.flash('success', "GoodBye !");
    res.redirect('/quotes');

});

module.exports = router;