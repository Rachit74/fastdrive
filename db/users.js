const pool = require('./pool')

async function createUser(username, email, password_hash) {
    const { rows } = await pool.query(
        "INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3)",
        [username, email, password_hash]
    );

    return rows[0];
}

module.exports = {
    createUser
};