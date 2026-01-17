const pool = require('./pool')

async function createUser(username, email, password_hash) {
    await pool.query(
        "INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3)",
        [username, email, password_hash]
    );
}

// findUserByEmail
async function findUserByEmail(email) {
    const { rows } = await pool.query(
        "SELECT * FROM users WHERE email = $1",
        [email]
    );

    return rows[0];
}

// getUserById
async function getUserByID(user_id) {
    const { rows } = await pool.query(
        `
        SELECT * FROM users WHERE id = $1;
        `,
        [user_id]
    );

    return rows[0];
}

// updateUser
async function updateUser(username, email, new_password_hash, user_id) {
    const { rows } = await pool.query(
        `
        UPDATE users
        SET username = $1, email = $2, password_hash = $3
        WHERE id = $4
        RETURNING *;
        `,
        [username, email, new_password_hash, user_id]
    );
    return rows[0];
}

module.exports = {
    createUser,
    findUserByEmail,
    getUserByID,
    updateUser,
};