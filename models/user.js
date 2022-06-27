const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');


const userSchema = new Schema({
    fullName:{
        type:String,
    },
    mobileNumber:{
        type:Number,
    },
    email:{
        type:String,
        unique:true
    },
    gender:{
        type:String,
        enum:['Male','Female','Others']
    },
    location:{
        type:String,
    },
    collegeName:{
        type:String
    },
    course:{
        type:String
    },
    adPost:[
        {
            type: Schema.Types.ObjectId,
            ref:'Product'
        }
    ]
})

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);