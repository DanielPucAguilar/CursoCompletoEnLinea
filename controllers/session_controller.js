// MW de autorizacion de acceso HTTP restringidos
exports.loginRequired = function(req,res,next){
    if(req.session.user){
        next();
    }else{
        res.redirect('/login');
    }
};

// Get /login 
exports.new = function(req,res){
    var errors = req.session.errors || {};
    req.session.errors = {};
    
    res.render('sessions/new',{errors: errors});
};

// POST /login 
exports.create = function(req, res){
    var login = req.body.login;
    var password = req.body.password;
    
    var userController = require('./user_controller');
    userController.autenticar(login,password,function(error,user){
        if(error){ 
            req.session.errors = [{"message": 'Se ha producido un error: ' + error}];
            res.redirect("/login");
            return;
        }
        
       
        req.session.user = {id:user.id,username:user.username,hora: Date.now()};
        
        res.redirect(req.session.redir.toString()); // redireccion al path anterior al login
    });
};

// DELETE /logout 
exports.destroy = function(req,res){
    delete req.session.user;
    res.redirect(req.session.redir.toString());
};