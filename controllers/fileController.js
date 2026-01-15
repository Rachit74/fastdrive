const db = require("../db");


exports.uploadFile = async (req, res) => {
    console.log("UPLOAD FILE ROUTE HIT!")

    if (!req.file) {
        res.status(400).json({
            message: "No File uploaded!",
        })
    }

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

    console.log(user_id);

    if (folder_id == undefined) {
        folder_id = null;
    }

    console.log(folder_id);

    const files = await db.files.getFiles(user_id, folder_id);

    
    return res.status(200).json({
        message: "File Found!",
        files,
    })

}