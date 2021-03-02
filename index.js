const express = require('express');
const path = require('path');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const Quote = require('./models/quote');


mongoose.connect('mongodb://localhost:27017/quotes',{
    useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology:true,
    useFindAndModify:false
});



const db = mongoose.connection;
db.on("error", console.error.bind(console, "connexion error:"));
db.once("open", ()=>{
    console.log("database connected");
});

const app = express();

app.set('view engine', 'ejs');
app.set('views',path.join(__dirname,'views'))

app.use(express.urlencoded({extended:true}));
//utiliser les put dans formulaire
app.use(methodOverride('_method'));


app.get('/', (req,res)=>{
    res.render("Home");
})

// obtenir la liste des citations
app.get('/quotes', async (req,res)=>{
    const quotes = await Quote.find({});
    // const q = new Quote({description:'my first quote', author:'Claire', book:'No book', year:'2021'});
   res.render('quotes/index', {quotes})
});


  //acceder au form pour post
  app.get('/quotes/new', (req,res)=>{
    res.render('quotes/create')
 });



//Créer une reservation
app.post('/quotes', async(req,res)=>{
    const quote = new Quote(req.body.quote);
    await quote.save();
    res.redirect(`quotes/${quote._id}`);
});



//details de la citation
app.get('/quotes/:id', async(req,res)=>{
    const quotes = await Quote.findById({_id:req.params.id})
    res.render('quotes/details', {quotes});
});


app.get('/quotes/:id/edit', async(req,res)=>{
    const quotes = await Quote.findById({_id:req.params.id})
    res.render('quotes/edit',{quotes});
});

//petit bug de redirection mais sinon ca fonctionne
app.put('/quotes/:id', async(req,res)=>{
    const { id } = req.params;
    const quote = await Quote.findByIdAndUpdate(id, { ...req.body.quote });
    // res.redirect(`quotes/${quote._id}`)
    res.redirect('/quotes');
});

app.delete('/quotes/:id', async(req,res)=>{
    const { id } = req.params;
    await Quote.findByIdAndDelete(id);
    res.redirect('/quotes');
});


app.listen(3000, ()=>{
    console.log('Serveur running on port 3000');
})