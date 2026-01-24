const db = require("../db");

exports.indexPage = async (req, res) => {
    // get user
    const user = req.user.userID;

    return res.render("index", { user });
}