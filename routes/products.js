const express = require('express');
const router = express.Router();
const catchAsync = require('../util/catchAsync');
const ExpressError = require('../util/ExpressError');
const Product = require('../models/products');
const {productSchema} = require("../schemas");
const {isLoggedIn} = require('../middleware');

const validateProduct = (req,res,next)=>{
    const {error} = productSchema.validate(req.body);

    if(error){
        const msg = error.details.map(el=>el.message).join(",");
        throw new ExpressError(msg,400);
    }
    else{
        next();
    }
}
router.get('/',catchAsync(async(req,res)=>{
    const products = await Product.find({});
    res.render('product/index',{products})
}))

router.get('/new',isLoggedIn,(req,res) =>{
    res.render('product/new');
})
router.post('/',isLoggedIn,validateProduct,catchAsync(async(req,res)=>{
    const product = new Product(req.body.product);
    await product.save();
    req.flash('success', 'Successfully made a new ad');;
    res.redirect(`product/${product._id}`);
}))
router.get('/:id',catchAsync(async(req,res)=>{
    const id = req.params.id;
    const product = await Product.findById(id);
    if (!product) {
        req.flash('error', 'Cannot find that product');
        return res.redirect('/product');
    }
    res.render('product/show',{product});
}))

router.get('/:id/edit',isLoggedIn, catchAsync(async(req,res)=>{
    const product = await Product.findById(req.params.id);
    if (!product) {
        req.flash('error', 'Cannot find that product');
        return res.redirect('/product');
    }
    res.render('product/edit',{product});
}))

router.put('/:id',isLoggedIn, validateProduct,catchAsync(async(req,res)=>{
    const id = req.params.id;
    const product = await Product.findByIdAndUpdate(id,{...req.body.product});
    // await product.save();
    req.flash('success', 'Successfully updated');
    res.redirect(`/product/${product._id}`);
}))

router.delete('/:id',isLoggedIn, catchAsync(async(req,res)=>{
    const id = req.params.id;
    const product = await Product.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted');
    res.redirect('/product');
}))

module.exports = router;