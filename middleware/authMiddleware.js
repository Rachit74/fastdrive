const jwt = require("jsonwebtoken");

module.exports = function authenticate(req, res, next) {

    const token = req.cookies.token

    if (!token || token == undefined) {
        req.flash("error", "Please Login to access");
        return res.redirect("/auth/login");
        // return res.status(401).json({
        //     message: "Authorization Header Missing!",
        // });
    }

    if (!token) {
        return res.status(401).json({
            message: "Token Missing",
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        res.locals.user = decoded
        next();
    } catch (error) {
        console.error("JWT ERROR:", error.message);
        return res.status(401).json({
            message: "Invalid or expired token",
        });
    }
};
