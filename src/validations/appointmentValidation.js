const { BadRequest } = require("../utils/errors")

function validateStudent(student) {
    if(!student) {
        throw new BadRequest ('aluno não deve ser nulo');
    }

    if (typeof(student.id) != "number") {
        throw new BadRequest ('id do aluno deve ser um número');
    }
}

function validateSchedule(schedule) {
    if(!schedule) {
        throw new BadRequest ('horário não deve ser nulo');
    }

    if (typeof(schedule.id) != "number") {
        throw new BadRequest ('id do horário deve ser um número');
    }
}

module.exports = {
    validateStudent,
    validateSchedule
}