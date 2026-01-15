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