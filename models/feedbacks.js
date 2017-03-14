var mongoose = require("mongoose");

var feedSchema = mongoose.Schema({
    feedback : String,
    Nom : String,
    Prénom : String
});

module.exports = mongoose.model("Feed", feedSchema );