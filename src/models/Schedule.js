class Schedule {
    constructor (weekday, begin, end, monitoring = null, id = null) {
        this.weekday = weekday;
        this.begin = begin;
        this.end = end;
        this.monitoring = monitoring;
        this.id = id;
    }
}

module.exports = Schedule;
