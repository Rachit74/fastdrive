const db = require("../db");


exports.createFolder = async (req, res) => {
    const user_id = req.user.userID;
    const { folder_name } = req.body;

    if (!folder_name) {
        return res.status(400).json({
            message: "folder name is required!",
        });
    }

    const folder = await db.folders.createFolder(folder_name, user_id);

    return res.status(201).json({
        message: "Folder Created",
        folder,
    });

}

exports.getFolders = async (req, res) => {
    const user_id = req.user.userID;

    const folders = await db.folders.getFolders(user_id);

    console.log(folders);

    return res.render("folders", { folders });
}