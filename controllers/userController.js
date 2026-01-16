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

exports.updateProfileForm = (req, res) => {
    return res.render("update");
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

        const user = await db.users.createUser(username, email, password_hash);

        return res.status(200).json({
            message: "User Registered!",
        });
        
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
        const user = await db.users.findUserByEmail(email);

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
                email: user.email,
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

        res.setHeader("HX-Redirect", "/auth/profile"); 
        return res.status(200).send("Redirecting...");

        // return res.status(200).json({
        //     message: "Login Successful!",
        //     token,
        // })
            
    } catch (error) {
        console.error("Login Error: ", error);
        return res.status(500).json({
            message: "Internal Server Error",
        });

    }
}

exports.updateProfile = async (req, res) => {
    try {

        const { username, email, new_password, old_password } = req.body;
        // console.log(req.body);

        const user_id = req.user.userID;
        // console.log(user_id);

        const user = await db.users.getUserByID(user_id);
        // console.log(user);

        if (!user) {
            return res.status(404).json({
                message: "User Not Found!"
            });
        }

        const isMatch = await bcrypt.compare(old_password, user.password_hash);

        if (!isMatch) {
            // using status code 200 becuase htmx does not swap the html for error codes like 401, 404 and 500
            return res.status(200).send('<p style="color: red; margin-bottom: 10px;">Invalid Password!</p>');

            // return res.status(401).send("Invalid Password");
                // return res.status(401).json({
                //     message: "Invalid Password!",
                // })
        }



        // hash new password
        const new_password_hash = await bcrypt.hash(new_password, 10);

        const updated_user = await db.users.updateUser(username, email, new_password_hash, user_id);

        res.setHeader("HX-Redirect", "/auth/profile");
        return res.status(200).json({
            message: "User Details Updated!",
            updated_user,
        })

        
    } catch (error) {
        console.error("Update Error: ", error);
        return res.status(500).json({
            error,
        })
    }
}

exports.userProfile = async (req, res) => {
    return res.render("profile")
}
