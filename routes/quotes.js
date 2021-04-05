const express = require('express');
const router = express.Router();
const Quote = require('../models/quote');
const User = require('../models/user');
const {isLoggedIn} = require('../middleware');
const user = require('../models/user');


// obtenir la liste des citations
router.get('/', async (req,res)=>{
    const quotes = await Quote.find({});
    const auth = await Quote.distinct("author");

   res.render('quotes/index', {quotes,auth})
});


//rechercher par auteur ou par chaîne de caracteres
router.get('/author', async (req,res)=>{  
    let result = req.query.author;
    let search = req.query.search;
    if(result  &&  search){
        let searchQuoteAuthor = await Quote.find({"description":new RegExp(search), "author": result });
        res.render('quotes/searchQuoteAuthor', {searchQuoteAuthor});
    } else if(result  !== '') {
        let list = await Quote.find({"author": result});
        res.render('quotes/searchResult', {list});
    }else {
        let searchQuote = await Quote.find({"description":new RegExp(search)});
        console.log(searchQuote);
        res.render('quotes/searchQuotes',{searchQuote});
    }  
 });



//acceder au form pour post
router.get('/new', isLoggedIn, (req,res)=>{
    res.render('quotes/create')
 });


 //Créer une citation
router.post('/', isLoggedIn, async(req,res)=>{
    const quote = new Quote(req.body.quote);
    quote.publisher = req.user._id;
    console.log("object");
    console.log(req.body.quote);
    console.log(quote.publisher);
    await quote.save();
    res.redirect(`quotes/${quote._id}`);
});


//details de la citation
router.get('/:id', async(req,res)=>{
    const quotes = await Quote.findById(req.params.id).populate('publisher');
    // console.log(quotes);
    res.render('quotes/details', {quotes});
});



//ajouter une citation en favori
router.get('/favorites/:id',isLoggedIn,  async(req,res)=>{

    const user = await User.findById(req.user._id);
    let favorite_id = req.params.id;

    if(favorite_id in user.favorites){
         await User.favorites.findByIdAndDelete(favorite_id); 
    }else{
        
        user.favorites = favorite_id;
        user.email = req.user.email;
        user.save();
        
    }
    res.render('quotes/favorites');

 });




router.get('/:id/edit', async(req,res)=>{
    const quotes = await Quote.findById({_id:req.params.id})
    res.render('quotes/edit',{quotes});
});


//petit bug de redirection mais sinon ca fonctionne
router.put('/:id', async(req,res)=>{
    const { id } = req.params;
    await Quote.findByIdAndUpdate(id, { ...req.body.quote });
    res.redirect('/quotes');
});



router.delete('/:id', async(req,res)=>{
    const { id } = req.params;
    await Quote.findByIdAndDelete(id);
    console.log("citation supprimée avec succes");
    res.redirect('/quotes');
});




module.exports = router;