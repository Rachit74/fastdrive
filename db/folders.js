const pool = require("./pool");

async function createFolder(folder_name, user_id) {
    const { rows } = await pool.query(
        `
        INSERT INTO folders (folder_name, user_id)
        VALUES ($1, $2)
        RETURNING *
        `,
        [folder_name, user_id]
    );

    return rows[0];
}

// get all folders
async function getFolders(user_id) {
    const { rows } = await pool.query(
        `
        SELECT * FROM folders
        WHERE user_id = $1;
        `,
        [user_id]
    );
    return rows;
}

module.exports = {
    createFolder,
    getFolders,
}