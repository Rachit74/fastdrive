const { Router } = require("express");

const userController = require("../controllers/userController");
const auth = require("../middleware/authMiddleware");

const userRouter = Router();

// form routes
userRouter.get('/signup', userController.userSignupForm);
userRouter.get('/login', userController.userLoginForm);
userRouter.get('/update', auth, userController.updateProfileForm);

// action routes
userRouter.post('/signup', userController.userSignup);
userRouter.post('/login', userController.userLogin);
userRouter.put('/update', auth, userController.updateProfile);


userRouter.get('/profile', auth, userController.userProfile);

userRouter.get('/logout', auth, userController.userLogout);


module.exports = userRouter;