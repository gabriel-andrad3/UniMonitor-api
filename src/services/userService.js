const userRepository = require('../repositories/userRepository');

async function getUsers() {
    return await userRepository.getUsers()
}

async function getUser(id) {
    return await userRepository.getUser(id);
}

module.exports = {
    getUsers,
    getUser
}
