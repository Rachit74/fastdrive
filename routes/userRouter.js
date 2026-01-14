const { Router } = require("express");

const userController = require("../controllers/userController");

const userRouter = Router();

userRouter.post('/signup', userController.userSignup);

module.exports = userRouter;