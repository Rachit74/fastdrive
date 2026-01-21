const db = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


// template render controllers
exports.userSignupForm = async (req, res) => {
    res.render("signup");
}

exports.userLoginForm = async (req,res) => {
    res.render("login");
}


exports.userSignup = async (req, res) => {
    try {

        const { username, email, password, confirm_password } = req.body;

        // Basic Validation
        if (!username || !email || !password || !confirm_password) {
            return res.status(400).json({
                message: "All fields are required!",
            })
        }

        if (password != confirm_password) {
            return res.status(400).json({
                message: "Passwords not not match!",
            })
        }

        // hash passworld
        const password_hash = await bcrypt.hash(password, 10);

        const user = await db.user.createUser(username, email, password_hash);

        // return res.status(200).json({
        //     message: "User Registered!",
        // });

        req.flash("success", "User Registered! Please Login.");
        return res.redirect("/auth/login");
        
    } catch (error) {
        console.error("Signup Error: ", error);
        return res.status(500).json({
            message: "Internal Server Error",
            error_ : error.detail
        })
    }
    

}


exports.userLogin = async (req,res) => {
    try {
         // validate data
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Please Provide Email!",
            });
        }

        // find user
        const user = await db.user.findUserByEmail(email);

        if (!user) {
            return res.status(401).json({
                message: "Invalid Email!",
            })
        }

        // compare password
        const isMatch = await bcrypt.compare(password, user.password_hash);

        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid Password!",
            })
        }

        const token = jwt.sign(
            {
                userID: user.id,
                username: user.username,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRES || '1d',
            }
        );

        // send cookie to brower to store jtw
        res.cookie("token", token, {
            httpOnly: true, // Prevents XSS attacks
            secure: process.env.NODE_ENV === "production", 
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        });

        // console.log(req.cookies);

        // return res.status(200).json({
        //     message: "Login Successful!",
        //     token,
        // })

        req.flash("success", "Login Successful!");
        return res.redirect("/user/profile");
            
    } catch (error) {
        console.error("Login Error: ", error);
        return res.status(500).json({
            message: "Internal Server Error",
        });

    }
}


exports.userLogout = async (req,res) => {
    res.clearCookie('token');

    req.flash("success", "Logout Successful!");
    return res.redirect("/auth/login");
}