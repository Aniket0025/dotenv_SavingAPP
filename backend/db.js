const mongoose = require("mongoose");

mongoose.connect(process.env.MONGODB_URI);
const Schema = mongoose.Schema;
const ObjectID = mongoose.ObjectID; 
const dotenv = require("dotenv");
dotenv.config();

const UserSchema = new Schema({
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    
})
const UserModel = mongoose.model("user", UserSchema);

module.exports = UserModel;



