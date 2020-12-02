const { BadRequest } = require("../utils/errors")

function validateWeekday(weekday) {
    if (typeof(weekday) !== "string") {
        throw new BadRequest("dia da semana deve ser uma string");
    }

    if (weekday.length === 0 || weekday.length > 100) {
        throw new BadRequest("tamanho do dia da semana deve estar entre 1 e 100")
    }
}

function validateBegin(begin) {
    if (typeof(begin) !== "string") {
        throw new BadRequest("início deve ser uma string");
    }

    if (begin <= 0) {
        throw new BadRequest("início deve ser maior que 0")
    }
}

function validateEnd(end) {
    if (typeof(end) !== "string") {
        throw new BadRequest("fim deve ser uma string");
    }

    if (end <= 0) {
        throw new BadRequest("fim deve ser maior que 0")
    }
}

function validateMonitoring(monitoring) {
    if (!monitoring) {
        throw new BadRequest("monitoria não deve ser nula");
    }

    if (typeof(monitoring.id) !== "number") {
        throw new BadRequest("id da monitoria deve ser um número");
    }
}

module.exports = {
    validateWeekday,
    validateBegin,
    validateEnd,
    validateMonitoring
}
