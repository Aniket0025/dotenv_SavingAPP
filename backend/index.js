const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const app = express();
dotenv.config();

const {userRouter} = require("./routes/user");
const { envRouter } = require("./routes/env");

app.use(cors({
  origin: true,
  credentials: false,
  allowedHeaders: ["Content-Type", "Authorization"],
  methods: ["GET","POST","PUT","DELETE","OPTIONS"],
}));

app.use(express.json());

app.use("/app/v1/user",userRouter);
app.use("/app/v1/env", envRouter);

const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
