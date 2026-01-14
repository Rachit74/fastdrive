const db = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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
            },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRES || '1d',
            }
        );

        return res.status(200).json({
            message: "Login Successful!",
            token,
        })
            
    } catch (error) {
        console.error("Login Error: ", error);
        return res.status(500).json({
            message: "Internal Server Error",
        });

    }
}