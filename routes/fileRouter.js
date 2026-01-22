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
    res.render("partials/upload", { layout: false });
})

// action routes
fileRouter.get("/files", auth, fileController.getFiles);

fileRouter.post("/upload", auth, upload.single('file'), fileController.uploadFile);

// download route
fileRouter.get("/download/:file_id", auth, fileController.downloadFile);

// delete route
fileRouter.post("/delete/:file_id", auth, fileController.deleteFile);

module.exports = fileRouter;