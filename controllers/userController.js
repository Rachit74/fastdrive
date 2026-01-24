const db = require("../db");
const bcrypt = require("bcrypt");


exports.updateProfileForm = (req, res) => {
    return res.render("update");
}



exports.updateProfile = async (req, res) => {
    try {

        const { username, email, new_password, old_password } = req.body;
        // console.log(req.body);

        if (!username || !email || !new_password || !old_password) {
            res.send('<p style="color: red; margin-bottom: 10px;">All Fields are required!</p>');
        }

        const user_id = req.user.userID;
        // console.log(user_id);

        const user = await db.user.getUserByID(user_id);
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

        }


        // hash new password
        const new_password_hash = await bcrypt.hash(new_password, 10);

        const updated_user = await db.user.updateUser(username, email, new_password_hash, user_id);

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
    const user = await db.user.getUserByID(req.user.userID);
    return res.render("profile", { user })
}

exports.deleteUserConfirm = function deleteUserConfirm(req, res) {
    res.render('delete-user');
}

exports.deleteUserAccount = async function deleteUserAccount(req, res) {
    // get current user id
    const user_id = req.user.userID;

    // get password and confirm_password from forms
    const { password, confirm_password } = req.body;

    // check if password and confirm_password are equal
    if (password != confirm_password) {
        req.flash("error", "Passwords must match");
        return res.redirect("/user/delete");
    }

    // get user data
    const user = await db.user.getUserByID(user_id);

    // handle not found
    if (!user) {
        res.status(404).json({
            message: "User not found!",
            code: 404,
        });
    }

    // compare hashes after validation

    const isMatch = await bcrypt.compare(user.password_hash, password);


    // wrong password handle
    if (!isMatch) {
        req.flash("error", "Invalid Password, Please try again!");
        return res.redirect("/user/delete");
    }

    // delete user if everything above validates
    // await db.user.deleteUser(user_id);

    req.flash("success", "User Account Was Deleted!");
    return res.redirect("/auth/signup");

}