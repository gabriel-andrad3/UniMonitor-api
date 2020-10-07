const pool = require('../../config/database');
const Role = require('../models/Role');

async function getRoles() {
    let query = 
        `select 
            id as id, 
            "name" as "name"
        from 
            "role"`;

    let result = await pool.query(query);

    if (result.rowCount == 0)
        return [];

    return result.rows.map(row => new Role(row.name.trim(), row.id));
}

module.exports = {
    getRoles
}
