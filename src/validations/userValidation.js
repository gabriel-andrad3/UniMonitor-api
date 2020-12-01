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

function validatePassword(password) {
    if (typeof(password) !== "string") {
        throw new BadRequest("register must be a string");
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/;

    if (!passwordRegex.test(password)) {
        throw new BadRequest("a senha deve possuir entre 8 e 16 caracteres, um número, uma letra minúscula, uma letra maiúscula e um caracter especial");
    }
}

module.exports = {
    validateName,
    validateRegister,
    validatePassword
}
