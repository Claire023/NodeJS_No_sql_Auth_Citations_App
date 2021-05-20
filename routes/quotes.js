const express = require('express');
const router = express.Router();
const Quote = require('../models/quote');
const User = require('../models/user');
const {isLoggedIn} = require('../middleware');
const user = require('../models/user');
const quote = require('../models/quote');



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

//acceder aux stats
router.get('/stats', async (req,res)=>{
    //nombre de citations sans auteurs
    let quoteWithoutAuthor = await Quote.find({"author": ""}).count();
    //auteur le plus cité
    let mainAuthor = await Quote.aggregate(
        [
          { $sortByCount : "$author"},
          { $limit : 1 }
        ]
     );

     //meilleur membre(qui a publié le plus)
     let mainPublisher = await Quote.aggregate(
        [
          { $sortByCount : "$publisher"},
           { $limit : 1 }
        ]
     );


    let findUserName = await User.findById(mainPublisher[0]._id);

    res.render('quotes/stats', {quoteWithoutAuthor,mainAuthor, findUserName })
 });



 router.get('/fav', isLoggedIn, async(req,res)=>{
        let user = await User.findById(req.user._id).populate('favorites');
        console.log(user.favorites);
        res.render('quotes/fav', {user});

})



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
    console.log("quotes");
    console.log(quotes);
    res.render('quotes/details', {quotes});
});


//ajouter une citation en favori
router.get('/favorites/:id', isLoggedIn, async(req,res)=>{
    let user = await User.findById(req.user._id).populate('favorites');
    let favorite_id = req.params.id;
    let result = false;

    if(user.favorites.length > 0){
        for(let i=0;i<user.favorites.length;i++){
            console.log("for")
            //  console.log(user.favorites[i]);
            if(user.favorites[i]._id == favorite_id){
                console.log("cette citation existe deja");
                result = true;
                break;
            }
            
            console.log("cette citation n'existe pas");   
        }
    }

    if(result){
        user.favorites.remove(favorite_id);
        console.log("supprime");
    }else{
        user.favorites.push(favorite_id);
        user.email = req.user.email;
        
        console.log('ajoute');
    }

    await user.save();

    res.render('quotes/favorites', {user});

 });



router.get('/:id/edit', async(req,res)=>{
    const quotes = await Quote.findById({_id:req.params.id})
    res.render('quotes/edit',{quotes});
});



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