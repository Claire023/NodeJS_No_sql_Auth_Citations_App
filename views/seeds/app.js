const mongoose = require('mongoose');
const quotes = require('./quotes');
const Quote = require('./models/quote');

mongoose.connect('mongodb://localhost:27017/quotes',{
    useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology:true
});


const db = mongoose.connection;
db.on("error", console.error.bind(console, "connexion error:"));
db.once("open", ()=>{
    console.log("database connected");
});

const seedDB = async()=>{
    await Quote.deleteMany({});
    for(let i=0; i<1, i++){

    }
    
}

seedDB();
