const { Unauthorized } = require('../utils/errors');

function validateRegister(register) {
    if (typeof(register) !== "string") {
        throw new Unauthorized("usuário e/ou senha inválido(s)");
    }

    if (register.length === 0 || register.length > 10) {
        throw new Unauthorized("usuário e/ou senha inválido(s)")
    }
}

function validatePassword(password) {
    if (typeof(password) !== "string") {
        throw new Unauthorized("usuário e/ou senha inválido(s)");
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/;

    if (!passwordRegex.test(password)) {
        throw new Unauthorized("usuário e/ou senha inválido(s)");
    }
}

module.exports = {
    validateRegister,
    validatePassword
}
