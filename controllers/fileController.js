const db = require("../db");
const fs = require("fs");



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

    // console.log(files);
    return res.render("files", { files });
}

exports.downloadFile = async (req, res) => {
    const file_id = req.params.file_id;
    console.log(file_id);

    const file = await db.files.getFileByID(file_id);

    // get file from db
    if (!file) {
        return res.status(404).send("File Not Found!")
    }

    const user_id = req.user.userID;
    console.log(user_id);
    console.log(file.id);
    
    // check ownership
    if (user_id != file.user_id) {
        return res.status(401).send("Access Denied");
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