const pool = require('../../config/database');
const Role = require('../models/Role');
const User = require('../models/User');

const selectQuery = `select 
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

async function getUsers() {  
    let result = await pool.query(selectQuery);

    return resultToUsers(result);
}

async function getUserById(id) {
    let query = `${selectQuery} where u.id = ${id}`;

    let result = await pool.query(query);

    return resultToUser(result);
}

async function getUserByRegister(register) {
    let query = `${selectQuery} where u.register = '${register}'`;

    let result = await pool.query(query);
    
    return resultToUser(result);
}

async function insertUser(user) {
    try {
        await pool.query('begin');
        
        const userQuery = `insert into "user" 
                                ("name", register) 
                            values 
                                ('${user.name}', '${user.register}') 
                            returning id`;

        let userResult = await pool.query(userQuery);

        user.id = userResult.rows[0].id;

        const userRolesQuery = `insert into user_role (role_id, user_id) values ${user.roles.map(role => `(${role.id}, ${user.id})`).join(', ')}`;
        await pool.query(userRolesQuery);

        pool.query('commit');

        return user;
    }
    catch (e) {
        pool.query('rollback');

        throw e;
    }
}

function resultToUser(result) {
    let users = resultToUsers(result);

    return users[0] ? users[0] : null;
}

function resultToUsers(result) {
    if (result.rowCount === 0)
        return [];

    let users = result.rows.reduce((acc, row) => {
        let user = acc.find(reg => reg.id == row.user_id);

        if (!user) {
            user = new User(row.user_name.trim(), row.user_register.trim(), [], row.user_id);

            acc.push(user);
        }

        user.roles.push(new Role(row.role_name.trim(), row.role_id));

        return acc;
    }, []);

    return users;
}

module.exports = {
    getUsers,
    getUserById,
    getUserByRegister,
    insertUser
}
