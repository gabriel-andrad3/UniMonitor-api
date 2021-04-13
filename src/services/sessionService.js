const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { userRepository } = require('../repositories');
const { Unauthorized } = require('../utils/errors');
const config = require('../../config/authorization');

async function createSession(register, password) {
    let result = await userRepository.getUserAndPasswordByRegister(register);

    if (!result.user)
        throw new Unauthorized(`usuário e/ou senha inválido(s)`);

    let isValid = await bcrypt.compare(password, result.passwordHash.trim());

    if (!isValid)
        throw new Unauthorized(`usuário e/ou senha inválido(s)`);

    const token = jwt.sign({ ...result.user }, config.appSecret);

    return { token: token };
}

async function createSessionUsingMicrosoftToken(authorization) {
    const [ bearer, token ] = authorization.split(' ');

    const decodedToken = jwt.decode(token);
    
    let user = await userRepository.getUserByEmail(decodedToken.upn);

    if (!user)
        throw new Unauthorized(`usuário não está pré cadastrado`);

    const newToken = jwt.sign({ ...user }, config.appSecret);

    return { token: newToken };
}

module.exports = {
    createSession,
    createSessionUsingMicrosoftToken
}
