const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    title:String,
    category:{
        type:String,
        lowercase:true,
        enum:['books','bicycle','trunk']
    },
    image:String,
    description:String,
    price:Number,
    location:String
})

const Product = mongoose.model('Product',ProductSchema);

module.exports = Product;