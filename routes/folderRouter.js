const { Router } = require("express");

const folderController = require("../controllers/folderController");
const auth = require("../middleware/authMiddleware");

const folderRouter = Router();

folderRouter.post("/new", auth, folderController.createFolder);

module.exports = folderRouter;