const express = require('express');
const router = express.Router();
const catchAsync = require('../util/catchAsync');
const ExpressError = require('../util/ExpressError');
const User = require('../models/user');
const passport = require('passport');
const Product = require('../models/products');

router.get('/register',(req,res)=>{
    res.render('user/register');
})
router.post('/register',catchAsync(async(req,res)=>{
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username});
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

router.get('/profile',async(req,res)=>{
    const currUser = await User.findById(req.user._id).populate('adPost');
    // console.log(currUser);
    res.render('user/profile',{currUser});
})


router.get('/profile/:userId',async(req,res)=>{
    const {userId} = req.params;
    const user = await User.findById(userId).populate('adPost');
    
    // console.log(user);
    res.render('user/otherProfile',{user});
    // const product = await Product.findById(req.params._id).populate('owner');
    // // console.log(product);
    // const currUser = product.owner;
    // res.render('user/profile',{currUser});
})

/**
 /profile - personal
 /prifile/:id - others 
/profile/prdocut.owner
 */

module.exports = router;