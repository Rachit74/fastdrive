const { Router } = require("express");

const userController = require("../controllers/userController");
const auth = require("../middleware/authMiddleware");

const userRouter = Router();

// form routes
userRouter.get('/update', auth, userController.updateProfileForm);

// action routes
userRouter.put('/update', auth, userController.updateProfile);


userRouter.get('/profile', auth, userController.userProfile);



module.exports = userRouter;