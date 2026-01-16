const express = require("express");
const path = require("node:path");
const expressLayouts = require("express-ejs-layouts");

const userRouter = require("./routes/userRouter");
const fileRouter = require("./routes/fileRouter");
const folderRouter = require("./routes/folderRouter");

const assetsPath = path.join(__dirname, "public");


require("dotenv").config();
const app = express();


app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(assetsPath));
app.use(expressLayouts);
app.set("layout", "layout"); // default layout.ejs

app.use((req, res, next) => {
    res.locals.user = null; // Default to null so EJS doesn't crash
    next();
});


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