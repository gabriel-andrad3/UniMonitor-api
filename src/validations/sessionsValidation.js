const jwt = require('jsonwebtoken');
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

async function validateMicrosoftToken(authorization) {
    if (!authorization)
        throw new Unauthorized('token não informado');

    const parts = authorization.split(' ');

    if (!parts.length === 2)
        throw new Unauthorized('token inválido');

    const [ bearer, token ] = parts;

    if (!/^Bearer$/i.test(bearer))
        throw new Unauthorized('token inválido');

    const decoded = jwt.decode(token);

    if (!decoded.upn.endsWith('@puccampinas.edu.br'))
        throw new Unauthorized('token inválido');
    
    // TODO: validar chaves e issuer
}

module.exports = {
    validateRegister,
    validatePassword,
    validateMicrosoftToken
}
