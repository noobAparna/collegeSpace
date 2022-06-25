const joi = require('joi');

module.exports.productSchema = joi.object({
    product : joi.object({
        title : joi.string().required(),
        price : joi.number().required().min(0),
        image : joi.string().required(),
        location : joi.string().required(),
        description : joi.string().required()
    }).required()
})