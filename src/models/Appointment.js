class Appointment {
    constructor(begin, end, student = null, schedule = null, id = null) {
        this.begin = begin;
        this.end = end;
        this.student = student;
        this.schedule = schedule;
        this.id = id;
    }
}

module.exports = Appointment;