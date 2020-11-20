const { BadRequest } = require("../utils/errors")

function validateSubject(subject) {
    if(!subject) {
        throw new BadRequest ('subject must not be null');
    }

    if (typeof(subject.id) != "number") {
        throw new BadRequest ('subject id must be a number');
    }
}

function validateMonitor(monitor) {
    if(!monitor) {
        throw new BadRequest ('monitor must not be null');
    }

    if (typeof(monitor.id) != "number") {
        throw new BadRequest ('monitor id must be a number');
    }
}

module.exports = {
    validateSubject,
    validateMonitor
}