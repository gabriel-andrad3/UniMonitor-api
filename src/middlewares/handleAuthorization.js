const jwt = require('jsonwebtoken');
const { Unauthorized, Forbidden } = require("../utils/errors");
const config = require('../../config/authorization');

function handleRoleAuthorization(roles = []) {
    return function (req, res, next) {
        const authorization = req.headers.authorization;

        if (!authorization)
            throw new Unauthorized('token não informado');
    
        const parts = authorization.split(' ');
    
        if (!parts.length === 2)
            throw new Unauthorized('token inválido');
    
        const [ bearer, token ] = parts;
    
        if (!/^Bearer$/i.test(bearer))
            throw new Unauthorized('token inválido');
    
        try {
            var decoded = jwt.verify(token, config.appSecret);
        }
        catch {
            throw new Unauthorized('token inválido');
        }

        if (roles.length >= 0) {
            let existentRoles = decoded.roles.filter(role => roles.includes(role.name));

            if (existentRoles.length === 0)
                throw new Forbidden('token sem as permissões necessárias');
        }

        next();
    }
}

module.exports = handleRoleAuthorization;
