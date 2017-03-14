var mongoose = require("mongoose");

var livrSchema = mongoose.Schema({
    dateL : String,
    nbrCom : String
});

module.exports = mongoose.model("Livr", livrSchema );