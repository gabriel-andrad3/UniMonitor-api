const bcrypt = require('bcrypt');
const { roleRepository, userRepository } = require('../repositories');
const { NotFound, Conflict } = require('../utils/errors');
const config = require('../../config/authorization');
const User = require('../models/User');

async function getUsers() {
    return await userRepository.getUsers()
}

async function getUser(id) {
    let user = await userRepository.getUserById(id);

    if (!user)
        throw new NotFound(`usuário com id ${id} não existe`);

    return user;
}

async function createUser(name, register, password) {
    let user = await userRepository.getUserByRegister(register);

    if (user)
        throw new Conflict(`usuário com registro ${register} já existe`);

    let existentRoles = await roleRepository.getRoles();
    let studentRole = existentRoles.find(x => x.name === 'Student');

    let passwordHash = await bcrypt.hash(password, config.hashSaltRounds);
    
    return await userRepository.insertUser(new User(name, register, [studentRole]), passwordHash);
}

async function updateUser(id, roles) {
    let user  = await userRepository.getUserById(id);

    if (!user)
        throw new NotFound(`usuário com id ${id} não existe`);

    let existentRoles = await roleRepository.getRoles();

    roles.forEach(role => {
        let existentRole = existentRoles.find(x => x.id === role.id)

        if (!existentRole)
            throw new Conflict(`função com id ${role.id} não existe`);

        role.name = existentRole.name;
    });

    user.roles = roles;

    return await userRepository.updateUser(user);
}

module.exports = {
    getUsers,
    getUser,
    createUser,
    updateUser
}
