const roleRepository = require('../repositories/roleRepository');

async function getRoles() {
    return await roleRepository.getRoles();
}

module.exports = {
    getRoles
};
