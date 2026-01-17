const db = require("../db");
const fs = require("fs");



exports.uploadFileForm = (req, res) => {
    res.render("upload");
}

exports.uploadFile = async (req, res) => {

    if (!req.file) {
        res.status(400).json({
            message: "No File uploaded!",
        })
    }


    const { filename, originalname, mimetype, size, path } = req.file

    const file_meta = await db.files.uploadFile(filename, originalname, mimetype, size, path, null, req.user.userID);

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

    // console.log(files);
    return res.render("files", { files });
}

exports.downloadFile = async (req, res) => {
    const file_id = req.params.file_id;

    const file = await db.files.getFileByID(file_id);

    // get file from db
    if (!file) {
        return res.status(404).send("404 FILE NOT FOUND!")
    }

    const user_id = req.user.userID;
    
    // check ownership
    if (user_id != file.user_id) {
        return res.status(401).send("ACCESS DENIED");
    }


    // check for physical presence on server
    if (!fs.existsSync(file.storage_path)) {
            return res.status(404).json({
            message: "File missing on server",
        });
    }

    return res.download(
        file.storage_path,
        file.original_name
    );

}