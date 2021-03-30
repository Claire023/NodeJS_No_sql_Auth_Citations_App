const express = require('express');
const router = express.Router();
const Quote = require('../models/quote');
const {isLoggedIn} = require('../middleware');


// obtenir la liste des citations
router.get('/', async (req,res)=>{
    const quotes = await Quote.find({});
    const auth = await Quote.distinct("author");
    console.log(req.body);
   res.render('quotes/index', {quotes,auth})
});


router.get('/author', async (req,res)=>{  
    let result = req.query.author;
    let list = await Quote.find({"author": result});
    res.render('quotes/searchResult', {list});
 });




//acceder au form pour post
router.get('/new', isLoggedIn, (req,res)=>{
    res.render('quotes/create')
 });




 //Créer une reservation
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


router.get('/:id/edit', async(req,res)=>{
    const quotes = await Quote.findById({_id:req.params.id})
    res.render('quotes/edit',{quotes});
});


//petit bug de redirection mais sinon ca fonctionne
router.put('/:id', async(req,res)=>{
    const { id } = req.params;
    const quote = await Quote.findByIdAndUpdate(id, { ...req.body.quote });
    res.redirect('/quotes');
});


router.delete('/:id', async(req,res)=>{
    const { id } = req.params;
    await Quote.findByIdAndDelete(id);
    console.log("citation supprimée avec succes");
    res.redirect('/quotes');
});




module.exports = router;