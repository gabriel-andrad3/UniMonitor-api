class User {
    constructor (name, register, roles, id = null) {
        this.name = name;
        this.register = register;
        this.roles = roles;
        this.id = id;
    }
}

module.exports = User;
