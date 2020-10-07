const pool = require('../../config/database');
const Role = require('../models/Role');
const User = require('../models/User');

async function getUsers() {
    let query = 
        `select 
            u.id as user_id, 
            u."name" as user_name, 
            u.register as user_register, 
            r.id as role_id, 
            r."name" as role_name 
        from 
            "user" u
        inner join user_role ur
            on u.id = ur.user_id 
        inner join "role" r 
            on ur.role_id = r.id`;
    
    let result = await pool.query(query);

    if (result.rowCount == 0)
        return [];

    let users = result.rows.reduce((acc, row) => {
        let user = acc.find(reg => reg.id == row.user_id);

        if (!user) {
            user = new User(row.user_name.trim(), row.user_register.trim(), [], row.user_id);

            acc.push(user);
        }

        user.roles.push(new Role(row.role_name.trim(), row.role_id));

        return acc;
    }, [])

    return users;
}

async function getUser(id) {
    let query = 
        `select 
            u.id as user_id, 
            u."name" as user_name, 
            u.register as user_register, 
            r.id as role_id, 
            r."name" as role_name 
        from 
            "user" u
        inner join user_role ur
            on u.id = ur.user_id 
        inner join "role" r 
            on ur.role_id = r.id
        where u.id = ${id}`;

    let result = await pool.query(query);

    if (result.rowCount == 0)
        return null;

    let roles = result.rows.map(row => new Role(row.role_name.trim(), row.role_id));
    
    return new User(result.rows[0].user_name.trim(), result.rows[0].user_register.trim(), roles, result.rows[0].user_id);
}

module.exports = {
    getUsers,
    getUser
}
