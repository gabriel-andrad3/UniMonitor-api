function sortById(objects) {
    objects = objects.sort((a, b) => a.id > b.id ? 1 : a.id < b.id ? -1 : 0);
}

function translateRoleName(name) {
    const roleNames = {
        Student: 'Aluno',
        Monitor: 'Monitor',
        Professor: 'Professor',
        Admin: 'Administrador'
    }

    return roleNames[name];
}