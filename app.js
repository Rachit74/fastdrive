const express = require("express");

const userRouter = require("./routes/userRouter");

require("dotenv").config();
app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/auth', userRouter);


const PORT = 8000;

app.listen(PORT, (error) => {
    if (error) {
        throw error
    }

    console.log("Server at localhost:8000")
})