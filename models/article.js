var mongoose = require("mongoose");

var artiSchema = mongoose.Schema({
    Auteur : String,
    date : String,
    titre : String,
    article : String
});

module.exports = mongoose.model("Arti", artiSchema );