const { BadRequest } = require("../utils/errors")

function validateName(name) {
    if (typeof(name) !== "string") {
        throw new BadRequest("name must be a string");
    }

    if (name.length === 0 || name.length > 50) {
        throw new BadRequest("name length must be between 1 and 50")
    }
}

function validateRegister(register) {
    if (typeof(register) !== "string") {
        throw new BadRequest("register must be a string");
    }

    if (register.length === 0 || register.length > 10) {
        throw new BadRequest("register length must be between 1 and 10")
    }
}

function validateRoles(roles) {
    if (!roles instanceof Array) {
        throw new BadRequest("roles must be an Array");
    }

    if (roles.length === 0) {
        throw new BadRequest("roles must not be empty");
    }

    roles.forEach(role => {
        if (typeof(role.id) !== "number") {
            throw new BadRequest("role id must be a number");
        }
    });
}

module.exports = {
    validateName,
    validateRegister,
    validateRoles
}
