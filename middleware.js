module.exports.isLoggedIn = (req, res, next)=>{
       if(!req.isAuthenticated()){
        req.flash('error', 'vous devez être connecté pour accéder à cette page');
       return res.redirect('/login');
    }
    next();
}