const { Router } = require("express");

const fileController = require("../controllers/fileController");
const auth = require("../middleware/authMiddleware");

const multer = require("multer");

const upload = multer({ dest: 'uploads/' });

const fileRouter = Router();

// 

// ejs render routes (get routes)
fileRouter.get("/upload", auth, fileController.uploadFileForm);

// action routes
fileRouter.get("/files", auth, fileController.getFiles);

fileRouter.post("/upload", auth, upload.single('file'), fileController.uploadFile);

fileRouter.get("/download/:file_id", auth, fileController.downloadFile);

// download route


// 

module.exports = fileRouter;