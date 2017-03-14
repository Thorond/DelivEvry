var express        = require("express"),
    app            = express(),
    bodyParser     = require("body-parser"),
    mongoose       = require("mongoose"),
    User           = require("./models/users"),
    Arti           = require("./models/article"),
    Livr           = require("./models/livraisons"),
    Récla          = require("./models/réclamations"),
    Feed           = require("./models/feedbacks"),
    expressSession = require("express-session"),
    cookieParser   = require('cookie-parser'),
    multer         = require('multer');


// ===========================

mongoose.connect("mongodb://delivevry:ProjetGate2016!@ds111940.mlab.com:11940/delivevry");
app.set("view engine", "ejs");

// fast-basin-79891 

var expiDate = new Date( Date.now() + 24 * 60 * 60 * 1000 ); // 24 hours

app.use(cookieParser());

app.use(expressSession({
    secret:"DelivEvry pour vous servir",
    resave: false,
    saveUninitialized:false,
    name: 'session',
    idNom: undefined,
    idPrénom: undefined,
    sesRéclamations:[],
    co: false,
    coAd: false,
    cookie: { 
            expires: expiDate
    }
}));

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));



// ===========================

app.get("/", function(req,res){
    condbUser();
    Arti.find({}, function(err, art){
        if(err){
            console.log(err);
        } 
        else {
            article = art;
            Livr.find({}, function(err, liv){
                if(err){
                    console.log(err);
                } 
                else {
                    livraison = liv;
                    res.render("index", {livraison : livraison, article: article,connecte : req.session.co, connecteAd : req.session.coAd, utilisateurNom : req.session.idNom, utilisateurPrénom : req.session.idPrénom} );
                } 
            });
        } 
    });
});

app.post("/",  function(req,res){
  
    var idArt = req.body.idArt;
    
    var idLiv = req.body.idLiv;
    
    var dateL = req.body.dateL,
        nbrCom = req.body.nbrCom,
        nouvLivr = { dateL: dateL, nbrCom: nbrCom };
    
    var Auteur = req.body.Auteur,
        date = req.body.date,
        titre = req.body.titre,
        article = req.body.article,
        nouvArti = { Auteur: Auteur, date: date, titre: titre, article: article };
    
    if (idArt !== undefined){
        Arti.findOneAndRemove({ _id: idArt }, function(err) {
            if ( err) {
                console.log(err);
            }
            else {
                idArt = undefined;
                res.redirect("/");
            }
        });
    }
    
    if (idLiv !== undefined){
        Livr.findOneAndRemove({ _id: idLiv }, function(err) {
            if ( err) {
                console.log(err);
            }
            else {
                idLiv = undefined;
                res.redirect("/");
            }
        });
        
    }
    
    if ( dateL !== undefined){
        Livr.create(nouvLivr, function(err, nouvCréation){
           if(err){
               console.log(err);
           } else {
               dateL = undefined;
               res.redirect("/");
           }
        });
        
    }
    if ( Auteur !== undefined){
        Arti.create(nouvArti, function(err, nouvCréation){
           if(err){
               console.log(err);
           } else {
               Auteur = undefined;
               res.redirect("/");
           }
        });
        
    }
    if (req.body.idNom !== undefined){
      req.session.idNom = req.body.idNom;
      req.session.idPrénom = req.body.idPrénom;
      req.session.save();
      loggedin(req,res);
      res.redirect("/");
    }
});

app.get("/index/new", function(req,res){
    res.render("index.ejs");
});


// ===========================
// ===========================


app.get("/commentCP", function(req,res){
    res.render("commentCP", {utilisateurNom : req.session.idNom, connecte : req.session.co, connecteAd : req.session.coAd, utilisateurPrénom : req.session.idPrénom});
});

app.get("/commentU6", function(req,res){
    res.render("commentU6", {utilisateurNom : req.session.idNom, connecte : req.session.co, connecteAd : req.session.coAd, utilisateurPrénom : req.session.idPrénom});
});

// ===========================


app.get("/reclamation", function(req,res){
    condbUser();
    Récla.find({Nom :  req.session.idNom  , "Prénom" :req.session.idPrénom}, function(err, réc){
        if(err){
            console.log(err);
        } 
        else {
            req.session.sesRéclamations = réc;
        } 
        res.render("reclamation", {réclamation : req.session.sesRéclamations, connecte : req.session.co, connecteAd : req.session.coAd, utilisateurNom : req.session.idNom, utilisateurPrénom : req.session.idPrénom});

    });
});

app.post("/reclamation", function(req,res){
    var idRéc = req.body.idRéc;
    
    var dateR = req.body.dateR,
        Nom = req.session.idNom,
        Prénom = req.session.idPrénom,
        référence = req.body.référence,
        plainte = req.body.plainte,
        prix = req.body.prix,
        nouvRécla = { dateR: dateR, Nom: Nom, Prénom: Prénom, référence:référence, prix:prix, plainte: plainte, traité : "0" };

    if (idRéc !== undefined){
        Récla.findOneAndRemove({ _id: idRéc }, function(err) {
            if ( err) {
                console.log(err);
            }
            else {
                idRéc = undefined;
                res.redirect("/reclamation");
            }
        });
        
    } else {
        Récla.create(nouvRécla, function(err, nouvCréation){
          if(err){
              console.log(err);
          } else {
              res.redirect("/reclamation");
          }
        });
        
    }
});
app.get("/reclamation/new", function(req,res){
    res.render("reclamation.ejs");
});

// ===========================
// ===========================

app.get("/reclamationAdmin", isLoggedin, function(req,res){
    Récla.find({}, function(err, réc){
        if(err){
            console.log(err);
        } 
        else {
            réclamation = réc;
            
        } 
    });
    
    res.render("reclamationAdmin", {réclamation : réclamation, connecte : req.session.co, connecteAd : req.session.coAd, utilisateurNom : req.session.idNom, utilisateurPrénom : req.session.idPrénom} );
});

app.post("/reclamationAdmin", function(req,res){
    var idRéc = req.body.idRéc;
    var idRécTraité = req.body.idRécTraité;
    
    if (idRéc !== undefined){
        Récla.findOneAndRemove({ _id: idRéc }, function(err) {
            if ( err) {
                console.log(err);
            }
            else {
                idRéc = undefined;
                res.redirect("/reclamationAdmin");
            }
        });
        
    }
    if (idRécTraité !== undefined){
      // moddbRéclaId(idRécTraité);
      idRécTraité = undefined;
      res.redirect("/reclamationAdmin");
    }
});

app.get("/reclamationAdmin/new", function(req,res){
    res.render("reclamationAdmin.ejs");
});

// ===========================
// ===========================

app.get("/feedback", function(req,res){
    Feed.find({}, function(err, fee){
        if(err){
            console.log(err);
        } 
        else {
            feedbacks = fee;
            res.render("feedback", {feedbacks : feedbacks, connecte: req.session.co, connecteAd : req.session.coAd, utilisateurNom : req.session.idNom, utilisateurPrénom : req.session.idPrénom});
        } 
    });
});

app.post("/feedback", function(req,res){
    var idFee = req.body.idFee;
    
    var Nom = req.session.idNom,
        Prénom = req.session.idPrénom,
        feed = req.body.feed,
        nouvFeed = { Nom: Nom, Prénom: Prénom, feedback : feed};

    if (idFee !== undefined){
        Feed.findOneAndRemove({ _id: idFee }, function(err) {
            if ( err) {
                console.log(err);
            }
            else {
                idFee = undefined;
                res.redirect("/feedback");
            }
        });
        
    } else {
        Feed.create(nouvFeed, function(err, nouvCréation){
          if(err){
              console.log(err);
          } else {
              res.redirect("/feedback");
          }
        });
        
    }
});
app.get("/feedback/new", function(req,res){
    res.render("feedback.ejs");
});

// ===========================
// ===========================

app.get("/equipe", function(req,res){
    res.render("equipe", {connecte : req.session.co, connecteAd : req.session.coAd, utilisateurNom : req.session.idNom, utilisateurPrénom : req.session.idPrénom});
});

// ===========================
// ===========================


var utilisateur = [],
    article = [],
    livraison =[],
    réclamation =[],
    feedbacks =[],
    traité=false;
condbUser();

app.get("/users", isLoggedin, function(req,res){
    condbUser();
    res.render("users", {utilisateur : utilisateur, connecte : req.session.co, connecteAd : req.session.coAd, utilisateurNom : req.session.idNom, utilisateurPrénom : req.session.idPrénom} );
});


app.post("/users", function(req,res){
    var idUse = req.body.idUse;
    
    if (idUse !== undefined){
        User.findOneAndRemove({ _id: idUse }, function(err) {
            if ( err) {
                console.log(err);
            }
            else {
                res.redirect("/users");
            }
        });
    }
    
    var Nom = req.body.Nom;
    var Prénom = req.body.Prénom;
    var numéro = req.body.numéro;
    var nouvUser = { Nom: Nom, Prénom: Prénom, numéro: numéro};
    if ( Nom !== undefined){
        var présent = false;
        utilisateur.forEach(function(uti){
            if ( Nom === uti.Nom && Prénom === uti.Prénom && numéro === uti.numéro){
                présent = true;
            } 
        });
        if ( présent !== true){
            User.create(nouvUser, function(err, nouvCréation){
               if(err){
                   console.log(err);
               } else {
                   res.redirect("/users");
               }
            });
        } else {
            res.redirect("/users");
        }
    }
});

app.get("/users/new", function(req,res){
    res.render("users.ejs");
});

// ===========================
// =======================

function condbUser (req,res){
    User.find({}, function(err, uti){
        if(err){
            console.log(err);
        } else {
            utilisateur = uti;
        } 
    });
}

// ===================================
// ===================================

function loggedin(req,res){
    if ( req.session.idNom === "lefevreAdmin" && req.session.idPrénom === "ProjetGate2016!"){
        req.session.coAd = true;
        req.session.co = true;
        req.session.save();
    } else {
        utilisateur.forEach(function(uti){
            if ( req.session.idNom === uti.Nom && req.session.idPrénom === uti.Prénom){
                req.session.co = true;
                Récla.find({Nom :  req.session.idNom  , "Prénom" :req.session.idPrénom}, function(err, réc){
                    if(err){
                        console.log(err);
                    } 
                    else {
                        req.session.sesRéclamations = réc;
                    }
                });
                req.session.save();
            } 
        });
        if (req.session.co === false) {
            req.session.idNom = undefined;
            req.session.idPrénom = undefined;
            req.session.sesRéclamations = [];
            req.session.save();
        }
    } 
    
}


function isLoggedin(req,res,next){
    loggedin(req,res);
    if ( req.session.coAd == true ){
        return next();
    }
    res.redirect("/");
}

// ===========================

app.get("/logout", function(req,res){
    req.session.co = false;
    req.session.coAd = false;
    req.session.idNom = undefined;
    req.session.idPrénom = undefined;
    req.session.sesRéclamations = [];
    res.redirect("/");
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server open");
});
