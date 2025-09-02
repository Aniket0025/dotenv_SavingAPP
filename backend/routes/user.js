const {Router} = require("express");
const UserModel = require("../db");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const zod = require("zod");
const { z } = require("zod");
const {model} = require("mongoose");
const {JWT_USER_PASSWORD}= require("../config");

dotenv.config();
const userRouter = Router();

userRouter.post("/signup",async function(req, res) {
    const {firstName, lastName, email, password} = req.body;

    try {
        const hashPassword = await bcrypt.hash(password, 10);
        
        await UserModel.create({
            email:email,
            password:hashPassword,
            firstName:firstName,
            lastName:lastName
        })
        res.status(200).json({message:"User created successfully"})
    }
    catch(error){
        res.status(500).json({message:"Internal server error"})
    }
})


userRouter.post("/signin",async function(req, res) {
    try{
        const {email, password} =  req.body;

        const user = UserModel.findOne({
            email:email
        });

        if(!user) {
            res.status(404).json({message:"User not found"})
        }
        const isMatch = await bcrypt.compare(password, user.password);
        
        if(!isMatch) {
            res.status(401).json({message:"Invalid credentials"})
        }

        const token = jwt.sign({
            id:user._id
        },JWT_USER_PASSWORD,{expiresIn:"1h"})

        res.json({
            message:"User logged in successfully",
            token:token
        })


    }
    catch(error){
        res.status(500).json({message:"Internal server error"})
    }
})

module.exports = {
    userRouter: userRouter
}






