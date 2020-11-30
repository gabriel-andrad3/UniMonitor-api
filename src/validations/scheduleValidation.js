const { BadRequest } = require("../utils/errors")

function validateWeekday(weekday) {
    if (typeof(weekday) !== "string") {
        throw new BadRequest("weekday must be a string");
    }

    if (weekday.length === 0 || weekday.length > 100) {
        throw new BadRequest("weekday length must be between 1 and 100")
    }
}

function validateBegin(begin) {
    if (typeof(begin) !== "time") {
        throw new BadRequest("begin must be a time");
    }

    if (begin <= 0) {
        throw new BadRequest("begin must be higher than 0")
    }
}

function validateEnd(end) {
    if (typeof(end) !== "time") {
        throw new BadRequest("end must be a time");
    }

    if (end <= 0) {
        throw new BadRequest("end must be higher than 0")
    }
}

function validateMonitoring(monitoring) {
    if (!monitoring) {
        throw new BadRequest("monitoring must not be null");
    }

    if (typeof(monitoring.id) !== "number") {
        throw new BadRequest("monitoring id must be a number");
    }
}

module.exports = {
    validateWeekday,
    validateBegin,
    validateEnd,
    validateMonitoring
}
