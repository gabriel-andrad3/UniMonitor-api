class User {
    constructor (name, register, roles, enrollments = [], email = null, id = null) {
        this.name = name;
        this.register = register;
        this.roles = roles;
        this.enrollments = enrollments;
        this.email = email;
        this.id = id;
    }
}

module.exports = User;
