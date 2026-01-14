const { Router } = require("express");

const userController = require("../controllers/userController");
const auth = require("../middleware/authMiddleware");

const userRouter = Router();

userRouter.post('/signup', userController.userSignup);
userRouter.post('/login', userController.userLogin);
userRouter.get('/profile', auth, (req, res) => {
    console.log("PROFILE ROUTE HIT");
    return res.json({
        message: "Protected Route",
        user: req.user,
    });
});


module.exports = userRouter;