const Product = require('./models/products');

module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl;
        req.flash('error','You must signed in first!');
        return res.redirect('/login');
    }
    next();
}

module.exports.isAuthor = async(req,res,next)=>{
    const {id} = req.params;
    const product = await Product.findById(id);
    if(!product.owner.equals(req.user._id)){
        req.flash('error','You dont have permission to do that!');
        return res.redirect(`/product/${id}`);
    }
    next();
}