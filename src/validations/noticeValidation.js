const { BadRequest } = require("../utils/errors")

function validateTitle(title) {
    if (typeof(title) !== "string") {
        throw new BadRequest("titulo deve ser uma string");
    }

    if (title.length === 0 || title.length > 50) {
        throw new BadRequest("tamanho do titulo deve estar entre 1 e 50")
    }
}

function validateBody(body) {
    if (typeof(body) !== "string") {
        throw new BadRequest("corpo deve ser uma string");
    }

    if (body.length === 0 || body.length > 240) {
        throw new BadRequest("tamanho do corpo deve estar entre 1 e 240")
    }
}

function validateSubjectId(subjectId) {
    if(!subjectId) {
        throw new BadRequest ('id da disciplina não dever ser nulo');
    }

    if (typeof(subjectId) != "number") {
        throw new BadRequest ('id da disciplina deve ser um número');
    }
}

module.exports = {
    validateTitle,
    validateBody,
    validateSubjectId
}
