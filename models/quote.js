const mongoose = require('mongoose');



const QuoteSchema = new mongoose.Schema({
    description:String,
    author:String,
    book:String,
    year:Number,
    publisher:{
        type:mongoose.Schema.Types.ObjectId, 
        ref:'User'
    },

});

module.exports = mongoose.model('Quote', QuoteSchema);
