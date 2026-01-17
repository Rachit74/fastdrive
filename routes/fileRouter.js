const { Router } = require("express");

const fileController = require("../controllers/fileController");
const auth = require("../middleware/authMiddleware");

const multer = require("multer");

const upload = multer({ dest: 'uploads/' });

const fileRouter = Router();

fileRouter.get("/upload", auth, fileController.uploadFileForm);

fileRouter.post("/upload", auth, upload.single('file'), fileController.uploadFile);
fileRouter.get("/files", auth, fileController.getFiles);

module.exports = fileRouter;