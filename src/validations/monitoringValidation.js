const { BadRequest } = require("../utils/errors")

function validateSubject(subject) {
    if(!subject) {
        throw new BadRequest ('disciplina não dever ser nulo');
    }

    if (typeof(subject.id) != "number") {
        throw new BadRequest ('id da disciplina deve ser um número');
    }
}

function validateMonitor(monitor) {
    if(!monitor) {
        throw new BadRequest ('monitor não dever ser nulo');
    }

    if (typeof(monitor.id) != "number") {
        throw new BadRequest ('id do monitor deve ser um número');
    }
}

module.exports = {
    validateSubject,
    validateMonitor
}