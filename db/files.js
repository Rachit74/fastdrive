const pool = require("./pool");


async function uploadFile(file_name, original_name, mime_type, file_size, storage_path, folder_id, user_id) {
    const { rows } = await pool.query(
        `
        INSERT INTO files (file_name, original_name, mime_type, file_size, storage_path, folder_id, user_id)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *;
        `,
        [file_name, original_name, mime_type, file_size, storage_path, folder_id, user_id]
    )

    return rows[0];
}

// This is the function to get all files for the user by user_id
// gets all files with the passed user_id, of every folder and nested folder
async function getFiles(user_id) {
    const { rows } = await pool.query(
        `
        SELECT *
        FROM files
        WHERE user_id = $1;
        `,
        [user_id]
    )

    return rows;
}

async function getFileByID(file_id) {
    const { rows } = await pool.query(
        `
        SELECT * FROM files
        WHERE id = $1;
        `,
        [file_id]
    );
    return rows[0];
}

// get files by folder id
async function getFilesByFolderID(folder_id, user_id) {
    const { rows } = await pool.query(
        `
        SELECT * FROM files
        WHERE folder_id = $1
        AND user_id = $2;
        `,
        [folder_id, user_id]
    );
    return rows;
}

// delete file by id
async function deleteFileByID(file_id) {
    await pool.query(
        `
        DELETE FROM files
        WHERE id = $1
        RETURNING *;
        `,
        [file_id]
    );
}

module.exports = {
    uploadFile,
    getFiles,
    getFileByID,
    getFilesByFolderID,
    deleteFileByID
}