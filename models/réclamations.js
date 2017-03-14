var mongoose = require("mongoose");

var réclaSchema = mongoose.Schema({
    dateR : String,
    Nom : String,
    Prénom : String,
    plainte :String,
    prix : String,
    référence : String,
    traité : String
});

module.exports = mongoose.model("Récla", réclaSchema );