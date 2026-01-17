const { Router } = require("express");

const folderController = require("../controllers/folderController");
const auth = require("../middleware/authMiddleware");

const folderRouter = Router();

folderRouter.post("/new", auth, folderController.createFolder);


folderRouter.get("/new", auth, (req,res) => {
    res.render("partials/new-folder", { layout: false });
})

folderRouter.get('/folders', auth, folderController.getFolders);

module.exports = folderRouter;