const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const app = express();
dotenv.config();

const {userRouter} = require("./routes/user");


app.use(express.json());

app.use("/app/v1/user",userRouter);




app.use(express.json());












const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
