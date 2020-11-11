class Subject {
    constructor (name, workload, professor = null, id = null) {
        this.name = name;
        this.workload = workload;
        this.professor = professor;
        this.id = id;
    }
}

module.exports = Subject;
