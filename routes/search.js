// const express = require('express');
// const router = express.Router();
// const Quote = require('../models/quote');
// const {isLoggedIn} = require('../middleware');


//afficher les auteurs dans le form
// router.get('/', async (req,res)=>{  
//    const auth = await Quote.distinct("author");
//    console.log("auth" +auth);
//    res.render('partials/search', {auth});
// });



// obtenir la liste des citations pour afficher l'auteur by search
// router.post('/author',async (req,res)=>{
//     const author = req.body.author;
//     console.log("requ param : ", author);
//     const searchAuthor = await Quote.distinct("author").find({"author":author});
//     //db.quotes.find({ "author": "Victor Hugo" })

//     console.log("search author : " ,searchAuthor);
//     res.render('quotes/searchResult',{searchAuthor});
// });
// router.get('/author', async (req,res)=>{  
//     // const auth = await Quote.distinct("author");
//     console.log(req.query.author);
//     let result = req.query.author;
//     let list = await Quote.find({"author": result});
//     console.log(list);

//     res.render('quotes/searchResult', {list});
//  });



// module.exports = router;