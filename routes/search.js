const express = require('express');
const router = express.Router();
const Quote = require('../models/quote');
const {isLoggedIn} = require('../middleware');


//afficher les auteurs dans le form
router.get('/', async (req,res)=>{
   //let quotes = await Quote.find({}).distinct('author');
   
   //const quotes = await db.getCollection('quotes').distinct('author');

    // console.log(_.uniq(quotes),true);
   res.render('quotes/index', {quotes})
});



// obtenir la liste des citations pour afficher l'auteur by search
router.post('/author',async (req,res)=>{
    const author = req.body.author;
    console.log("requ param : ", author);
    const searchAuthor = await Quote.find({"author":author});

    console.log("search author : " ,searchAuthor);
    res.render('quotes/searchResult',{searchAuthor});
});



module.exports = router;