const userRepository = require('../repositories/userRepository');
const { NotFound } = require('../utils/errors');

async function getUsers() {
    return await userRepository.getUsers()
}

async function getUser(id) {
    let user = await userRepository.getUser(id);

    if (!user)
        throw new NotFound(`user with id ${id} not found`);

    return user;
}

module.exports = {
    getUsers,
    getUser
}
