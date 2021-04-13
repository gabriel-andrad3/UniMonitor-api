class User {
    constructor (name, register, roles, email = null, id = null) {
        this.name = name;
        this.register = register;
        this.roles = roles;
        this.email = email;
        this.id = id;
    }
}

module.exports = User;
