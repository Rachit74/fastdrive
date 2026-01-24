const { Router } = require("express");

const indexRouter = Router();

const auth = require("../middleware/authMiddleware");

const indexController = require("../controllers/indexController");

indexRouter.get("/", auth, indexController.indexPage);

module.exports = indexRouter;
