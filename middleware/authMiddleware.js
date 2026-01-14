const jwt = require("jsonwebtoken");

module.exports = function authenticate(req, res, next) {
    console.log("AUTH HEADER:", req.headers.authorization);

    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            message: "Authorization Header Missing!",
        });
    }

    const token = authHeader.split(" ")[1];
    console.log("TOKEN:", token);

    if (!token) {
        return res.status(401).json({
            message: "Token Missing",
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("DECODED:", decoded);
        req.user = decoded;
        next();
    } catch (error) {
        console.error("JWT ERROR:", error.message);
        return res.status(401).json({
            message: "Invalid or expired token",
        });
    }
};
