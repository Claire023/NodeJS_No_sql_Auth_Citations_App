const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//pour authentication
const passportLocalMongoose = require('passport-local-mongoose');
const quote = require('./quote');


const UserSchema = new Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    favorites : [{    
        type:mongoose.Schema.Types.ObjectId, 
        ref:'Quote'
    }]
});


UserSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', UserSchema);
