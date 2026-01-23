const db = require("../db");


exports.createFolder = async (req, res) => {
    const user_id = req.user.userID;
    const { folder_name, folder_id } = req.body;


    const parent_id = folder_id;

    if (!folder_name) {
        return res.status(400).json({
            message: "folder name is required!",
        });
    }

    const folder = await db.folders.createFolder(folder_name, user_id, parent_id);

    req.flash("success", "Folder Created");
    return res.redirect(`/folder/folders/${folder.id}`);

}

exports.getFolders = async (req, res) => {
    const user_id = req.user.userID;

    const folders = await db.folders.getFolders(user_id);

    // console.log(folders);

    return res.render("folders", { folders });
}

// individual folder controller
exports.getFolderByID = async (req, res) => {
    const user_id = req.user.userID;
    const { folder_id } = req.params;

    const folder = await db.folders.getFolderByID(folder_id);

    // for debug
    console.log(folder);

    const files = await db.files.getFilesByFolderID(folder_id, user_id);

    return res.render("files", { files , folder });

}
