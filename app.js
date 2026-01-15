const express = require("express");

const userRouter = require("./routes/userRouter");
const fileRouter = require("./routes/fileRouter");
const folderRouter = require("./routes/folderRouter");

require("dotenv").config();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/auth', userRouter);
app.use('/file', fileRouter);
app.use("/folder", folderRouter);


const PORT = 8000;

app.listen(PORT, (error) => {
    if (error) {
        throw error
    }

    console.log("Server at localhost:8000")
})