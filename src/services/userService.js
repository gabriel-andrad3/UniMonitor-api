const userRepository = require('../repositories/userRepository');
const roleRepository = require('../repositories/roleRepository');
const { NotFound, Conflict } = require('../utils/errors');
const User = require('../models/User');

async function getUsers() {
    return await userRepository.getUsers()
}

async function getUser(id) {
    let user = await userRepository.getUserById(id);

    if (!user)
        throw new NotFound(`user with id ${id} not found`);

    return user;
}

async function createUser(name, register, roles) {
    let user = await userRepository.getUserByRegister(register);

    if (user)
        throw new Conflict(`user with register ${register} already exists`);

    let existentRoles = await roleRepository.getRoles();

    roles.forEach(role => {
        let existentRole = existentRoles.find(x => x.id === role.id)

        if (!existentRole)
            throw new Conflict(`role with id ${role.id} does not exist`);

        role.name = existentRole.name;
    });
    
    return await userRepository.insertUser(new User(name, register, roles));
}

module.exports = {
    getUsers,
    getUser,
    createUser
}
