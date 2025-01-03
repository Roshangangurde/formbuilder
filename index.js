const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const mongoose = require("mongoose");
const app = express();
const {incomingRequestLogger}=require("./middleware/index.js");
const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGOOSE_URI_STRING;
const indexRouter =require("./routes/index");
const userRouter = require("./routes/user.js")
const formRouter = require("./routes/form.js")
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(incomingRequestLogger);

app.use("/api/v1/",indexRouter);
app.use("/api/v1/",userRouter);
app.use("/api/v1/",formRouter);

app.listen(PORT,() =>{
    console.log(`server is running on port ${PORT}`);
    mongoose.connect(MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then(() => {
        console.log("MongoDB connected");
    }).catch((err) => {
        console.log(err);
    });
});
