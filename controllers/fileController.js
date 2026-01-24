const console = require("console");
const db = require("../db");
const fs = require("fs");



exports.uploadFileForm = async (req, res) => {
    const folder_id = req.query.folder_id || null;

    let folder = null;
    if (folder_id) {
        folder = await db.folders.getFolderByID(folder_id);
    }
    
    res.render("upload-file", {
        folder,
        folder_id
    });
};


exports.uploadFile = async (req, res) => {

    if (!req.file) {
        res.status(400).json({
            message: "No File uploaded!",
        })
    }

    const folder_id = req.body.folder_id || null;

    const { filename, originalname, mimetype, size, path } = req.file

    await db.files.uploadFile(filename, originalname, mimetype, size, path, folder_id, req.user.userID);

    // return res.status(200).json({
    //     message: "File uploaded successfully",
    //     filename: req.file.filename
    // });

    req.flash("success", "File uploaded successfully");
    return res.redirect("/files");
}

// controller to get all the user files from every folder and sub folder
exports.getFiles = async (req, res) => {

    const user_id = req.user.userID;
    let folder = null;

    const files = await db.files.getFiles(user_id);

    return res.render("files", { files, folder });
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

exports.deleteFile = async (req, res) => {
    const { file_id } = req.params;

    const file = await db.files.getFileByID(file_id);

    if (!file) {
        req.flash("error", "File not found");
        return res.redirect("/files");
    }

    const user_id = req.user.userID;

    // check ownership
    if (user_id != file.user_id) {
        req.flash("error", "Access Denied");
        return res.redirect("/files");
    }

    // delete physical file
    fs.unlinkSync(file.storage_path);

    // delete from db
    await db.files.deleteFileByID(file_id);

    req.flash("success", "File deleted successfully");
    return res.redirect("/files");
}