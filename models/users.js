var mongoose = require("mongoose");

var utilSchema = mongoose.Schema({
    Nom : String,
    Prénom : String,
    numéro : String
});

module.exports = mongoose.model("User", utilSchema );