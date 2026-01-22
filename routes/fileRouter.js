const { Router } = require("express");

const fileController = require("../controllers/fileController");
const auth = require("../middleware/authMiddleware");

const multer = require("multer");

const upload = multer({ dest: 'uploads/' });

const fileRouter = Router();

// 

// ejs render routes (get routes)
// fileRouter.get("/upload", auth, fileController.uploadFileForm);

fileRouter.get("/upload", auth, (req,res) => {
    let folder_id = req.query.folder_id;
        if (!folder_id || folder_id === "null") {
        folder_id = null;
    }
    res.render("partials/upload", { layout: false, folder_id });
})

// action routes
fileRouter.get("/files", auth, fileController.getFiles);

fileRouter.post("/upload", auth, upload.single('file'), fileController.uploadFile);

// download route
fileRouter.get("/download/:file_id", auth, fileController.downloadFile);

// delete route
fileRouter.post("/delete/:file_id", auth, fileController.deleteFile);

module.exports = fileRouter;