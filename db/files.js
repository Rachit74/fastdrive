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

// async function getFiles(params) {
    
// }

module.exports = {
    uploadFile,
}