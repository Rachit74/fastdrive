const { Router } = require("express");

const authController = require("../controllers/authController");
const auth = require("../middleware/authMiddleware");

const authRouter = Router();

// form routes
authRouter.get('/signup', authController.userSignupForm);
authRouter.get('/login', authController.userLoginForm);

// action routes
authRouter.post('/signup', authController.userSignup);
authRouter.post('/login', authController.userLogin);
authRouter.get('/logout', auth, authController.userLogout);


module.exports = authRouter;