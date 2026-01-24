const express = require("express");
const path = require("node:path");
const expressLayouts = require("express-ejs-layouts");
const cookieParser = require("cookie-parser");
const sessipon = require("express-session");
const flash = require("connect-flash");

const authRouter = require("./routes/authRouter");
const userRouter = require("./routes/userRouter");
const fileRouter = require("./routes/fileRouter");
const folderRouter = require("./routes/folderRouter");
const indexRouter = require("./routes/indexRouter");
const session = require("express-session");

const assetsPath = path.join(__dirname, "public");


require("dotenv").config();
const app = express();


app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");


app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(assetsPath));
app.use(expressLayouts);
app.set("layout", "layout"); // default layout.ejs

// flash messages
app.use(session({
    secret: process.env.SESSION_SECRET || "secret",
    resave: false,
    saveUninitialized: true,
}));
app.use(flash());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});


app.use((req, res, next) => {
    res.locals.user = null; // Default to null so EJS doesn't crash
    next();
});


app.use('/auth', authRouter);
app.use('/user', userRouter);
app.use('/', fileRouter);
app.use("/folder", folderRouter);
app.use('/', indexRouter);

const PORT = 8000;

app.listen(PORT, (error) => {
    if (error) {
        throw error
    }

    console.log("Server at localhost:8000")
})