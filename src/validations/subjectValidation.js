const { BadRequest } = require("../utils/errors")

function validateName(name) {
    if (typeof(name) !== "string") {
        throw new BadRequest("name must be a string");
    }

    if (name.length === 0 || name.length > 100) {
        throw new BadRequest("name length must be between 1 and 100")
    }
}

function validateWorkload(workload) {
    if (typeof(workload) !== "number") {
        throw new BadRequest("workload must be a number");
    }

    if (workload <= 0) {
        throw new BadRequest("workload must be higher than 0")
    }
}

function validateProfessor(professor) {
    if (!professor) {
        throw new BadRequest("professor must not be null");
    }

    if (typeof(professor.id) !== "number") {
        throw new BadRequest("professor id must be a number");
    }
}

module.exports = {
    validateName,
    validateWorkload,
    validateProfessor
}
