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

module.exports = {
    createUser,
    findUserByEmail,
};