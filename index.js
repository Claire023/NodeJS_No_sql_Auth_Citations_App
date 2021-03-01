const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Quote = require('./models/quote');


// const quotes_table = [
//     {
//         description: 'my first quote',
//         author: 'Claire',
//         book: 'No book',
//         year: '2021'
//     },
//     {
//         description: 'Une quote',
//         author: 'Nico',
//         book: 'Satan est présent',
//         year: '1994'
//     },
//     {
//         description: 'Une quote',
//         author: 'Maxime',
//         book: 'Un livre à la con',
//         year: '1999'
//     },
//     {
//         description: 'Une quote',
//         author: 'Lucie',
//         book: 'Une licorne',
//         year: '1992'
//     },
//     {
//         description: 'Une quote',
//         author: 'Yanis',
//         book: 'Martine va à la ferme',
//         year: '1996'
//     },
// ]

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

const app = express();

app.set('view engine', 'ejs');
app.set('views',path.join(__dirname,'views'))


app.get('/', (req,res)=>{
    res.render("Home");
})

// app.get('/makequote',  (req,res)=>{
//     Quote.find({}).then((quotes_table)=>{
//         res.send(quotes_table);
//     })
// })


// obtenir la liste des citations
app.get('/quotes', async (req,res)=>{
    const quotes = await Quote.find({});
    // const q = new Quote({description:'my first quote', author:'Claire', book:'No book', year:'2021'});
   res.render('quotes/index', {quotes})
})






app.listen(3000, ()=>{
    console.log('Serveur running on port 3000');
})