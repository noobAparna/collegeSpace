const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const Product = require('./models/products');
const methodOverride = require('method-override');
mongoose.connect('mongodb://localhost:27017/collegeSpace')
    .then(()=>{
        console.log('Database Connected');
    })
    .catch(err =>{
        console.log('Oh No Error');
        console.log(err);
    })

const app = express();
app.engine('ejs',ejsMate);
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));

app.get('/product',async(req,res)=>{
    const products = await Product.find({});
    res.render('product/index',{products})
})

app.get('/product/new',(req,res) =>{
    res.render('product/new');
})
app.post('/product',async(req,res)=>{
    const product = new Product(req.body.product);
    await product.save();
    res.redirect(`product/${product._id}`);
})
app.get('/product/:id',async(req,res)=>{
    const id = req.params.id;
    const product = await Product.findById(id);
    res.render('product/show',{product});
})

app.get('/product/:id/edit',async(req,res)=>{
    const product = await Product.findById(req.params.id);
    res.render('product/edit',{product});
})

app.put('/product/:id',async(req,res)=>{
    const id = req.params.id;
    const product = await Product.findByIdAndUpdate(id,{...req.body.product});
    // await product.save();
    res.redirect(`/product/${product._id}`);
})

app.delete('/product/:id',async(req,res)=>{
    const id = req.params.id;
    const product = await Product.findByIdAndDelete(id);
    res.redirect('/product');
})
app.listen(3000,()=>{
    console.log('Serving on port 3000');
})      