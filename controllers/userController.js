const db = require("../db");
const bcrypt = require("bcrypt");

exports.userSignup = async (req, res) => {
    try {

        const { username, email, password, confirm_password } = req.body;

        // Basic Validation
        if (!username || !email || !password || !confirm_password) {
            return res.status(400).json({
                message: "All fields are required!"
            })
        }

        if (password != confirm_password) {
            return res.status(400).json({
                message: "Passwords not not match!"
            })
        }

        // hash passworld
        const password_hash = await bcrypt.hash(password, 10);

        const user = await db.users.createUser(username, email, password_hash);

        return res.status(200).json({
            message: "User Registered!"
        })
        
    } catch (error) {
        console.error("Signup Error: ", error);
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
    

}