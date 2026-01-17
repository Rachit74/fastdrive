const db = require("../db");


exports.uploadFileForm = (req, res) => {
    res.render("upload");
}

exports.uploadFile = async (req, res) => {
    console.log("UPLOAD FILE ROUTE HIT!")

    if (!req.file) {
        res.status(400).json({
            message: "No File uploaded!",
        })
    }

    console.log(req.file);

    const { filename, originalname, mimetype, size, path } = req.file

    const file_meta = await db.files.uploadFile(filename, originalname, mimetype, size, path, null, req.user.userID);

    console.log(file_meta);
    return res.status(200).json({
        message: "File uploaded successfully",
        filename: req.file.filename
    });
}

exports.getFiles = async (req, res) => {

    const user_id = req.user.userID;
    let { folder_id } = req.params;


    if (folder_id == undefined) {
        folder_id = null;
    }

    const files = await db.files.getFiles(user_id, folder_id);

    console.log(files);
    return res.render("files", { files });
}