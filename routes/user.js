const express = require('express');
const router = express.Router();
const catchAsync = require('../util/catchAsync');
const ExpressError = require('../util/ExpressError');
const User = require('../models/user');
const passport = require('passport');

router.get('/register',(req,res)=>{
    res.render('user/register');
})
router.post('/register',catchAsync(async(req,res)=>{
    try {
        const { email, fullName, password } = req.body;
        const user = new User({ email, fullName});
        const registeredUser = await User.register(user, password);
        req.login(registeredUser,err =>{
            if(err) return next(err);
            req.flash('success', 'Welcome to collegeSpace!');
            res.redirect('/product');
        })
    }
    catch (e) {
        req.flash('error', e.message);
        res.redirect('/register');
    }
}))

router.get('/login',(req,res)=>{
    res.render('user/login');
})

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
    req.flash('success', 'Welcome Back!!');
    const redirectUrl = req.session.returnTo || '/product';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
})

router.get('/logout', (req, res,next) => {
    req.logout(err=>{
        if(err) return next(err);
        req.flash('success', 'goodbye!');
        res.redirect('/product');
    });
})

module.exports = router;