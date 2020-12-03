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

function validateTime(begin, end) {
    let beginParts = begin.split(':');

    let beginHour = Number(beginParts[0]);
    let beginMinutes = Number(beginParts[1]);

    let endParts = end.split(':');

    let endHour = Number(endParts[0]);
    let endMinutes = Number(endParts[1]);

    if (beginHour > endHour) {
        throw new BadRequest("o horário de início deve ser menor que o horário de fim");
    } 
    else if (beginHour === endHour && beginMinutes > endMinutes)  {
        throw new BadRequest("o horário de início deve ser menor que o horário de fim");
    }
}

module.exports = {
    validateWeekday,
    validateBegin,
    validateEnd,
    validateMonitoring,
    validateTime
}
