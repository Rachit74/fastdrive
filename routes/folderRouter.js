const { Router } = require("express");

const folderController = require("../controllers/folderController");
const auth = require("../middleware/authMiddleware");

const folderRouter = Router();

folderRouter.post("/new", auth, folderController.createFolder);


folderRouter.get("/new", auth, (req,res) => {
    let folder_id = req.query.folder_id;
    if (!folder_id || folder_id === null) {
        folder_id = null;
    }
    res.render("new-folder", { folder_id });
})

folderRouter.get('/folders', auth, folderController.getFolders);

folderRouter.get('/folders/:folder_id', auth, folderController.getFolderByID);

module.exports = folderRouter;