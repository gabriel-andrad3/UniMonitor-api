const { BadRequest } = require("../utils/errors")

function validateName(name) {
    if (typeof(name) !== "string") {
        throw new BadRequest("nome deve ser uma string");
    }

    if (name.length === 0 || name.length > 50) {
        throw new BadRequest("tamanho do nome deve estar entre 1 and 50")
    }
}

function validateRegister(register) {
    if (typeof(register) !== "string") {
        throw new BadRequest("registro deve ser uma string");
    }

    if (register.length === 0 || register.length > 10) {
        throw new BadRequest("tamanho do registro deve estar entre 1 e 10")
    }
}

function validateRoles(roles) {
    if (!roles instanceof Array) {
        throw new BadRequest("funções deve ser um Array");
    }

    if (roles.length === 0) {
        throw new BadRequest("funções não deve estar vazio");
    }

    roles.forEach(role => {
        if (typeof(role.id) !== "number") {
            throw new BadRequest("id da função deve ser um número");
        }
    });
}

module.exports = {
    validateName,
    validateRegister,
    validateRoles
}
