var mongoose = require("mongoose");
var passportLocaLMongoose = require("passport-local-mongoose");

var UserSchema =  new mongoose.Schema({
	username: String,
	password: String
});

UserSchema.plugin(passportLocaLMongoose);

module.exports = mongoose.model("User", UserSchema);