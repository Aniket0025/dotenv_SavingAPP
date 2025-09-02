const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const {JWT_USER_PASSWORD} = require("../config");

const userMiddleware = function(req, res, next) {
    let token = req.headers.token;
    const authHeader = req.headers["authorization"] || req.headers["Authorization"];
    if (!token && authHeader && typeof authHeader === "string" && authHeader.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];
    }
    if(!token) {
        return res.status(401).json({message:"Unauthorized"})
    }
 
    try{
        const decoded = jwt.verify(token, JWT_USER_PASSWORD);
        req.user = decoded;
        next();
    }
    catch(error){
        res.status(401).json({message:"Unauthorized"})
    }
}


module.exports = {
    userMiddleware: userMiddleware
}