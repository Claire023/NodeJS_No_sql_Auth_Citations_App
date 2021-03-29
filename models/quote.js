const mongoose = require('mongoose');



const QuoteSchema = new mongoose.Schema({
    description:String,
    book:String,
    year:Number,
    publisher:{
        type:mongoose.Schema.Types.ObjectId, 
        ref:'User'
    },
    author:{
        type:mongoose.Schema.Types.ObjectId, 
        ref:'Author'
    }
});

module.exports = mongoose.model('Quote', QuoteSchema);