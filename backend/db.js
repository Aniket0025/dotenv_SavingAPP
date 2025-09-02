const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

mongoose.connect(process.env.MONGODB_URI);
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId; 
 
const UserSchema = new Schema({
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    
})

const EnvVarSchema = new Schema({
    userId: {type: ObjectId, ref: "user", required: true, index: true},
    key:{type:String, required:true},
    value: {type:String, required:true} 
},
{
    timestamps:true
});

// Ensure a user cannot have duplicate keys
EnvVarSchema.index({ userId: 1, key: 1 }, { unique: true });

const UserModel = mongoose.model("user", UserSchema);
const EnvVarModel = mongoose.model("envVar", EnvVarSchema);
module.exports ={
 UserModel,
 EnvVarModel
}
