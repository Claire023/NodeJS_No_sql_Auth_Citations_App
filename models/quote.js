const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const QuoteSchema = new Schema({
    description:String,
    author:String,
    book:String,
    year:Number
});

module.exports = mongoose.model('Quote', QuoteSchema);