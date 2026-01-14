const { Router } = require("express");

const userController = require("../controllers/userController");

const userRouter = Router();

userRouter.post('/signup', userController.userSignup);
userRouter.get('/login', userController.userLogin);

module.exports = userRouter;