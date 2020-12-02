const { BadRequest } = require("../utils/errors")

function validateName(name) {
    if (typeof(name) !== "string") {
        throw new BadRequest("nome deve ser uma string");
    }

    if (name.length === 0 || name.length > 100) {
        throw new BadRequest("tamanho do nome deve estar entre 1 e 100")
    }
}

function validateWorkload(workload) {
    if (typeof(workload) !== "number") {
        throw new BadRequest("carga horária deve ser um número");
    }

    if (workload <= 0) {
        throw new BadRequest("carga horária deve ser maior que 0")
    }
}

function validateProfessor(professor) {
    if (!professor) {
        throw new BadRequest("professor não deve ser nulo");
    }

    if (typeof(professor.id) !== "number") {
        throw new BadRequest("id do professor deve ser um número");
    }
}

module.exports = {
    validateName,
    validateWorkload,
    validateProfessor
}
