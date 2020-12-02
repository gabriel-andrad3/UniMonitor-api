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

function translateWeekday(value) {
    const weekdayValueText = {
        segunda: 'Segunda',
        terça: 'Terça',
        quarta: 'Quarta',
        quinta: 'Quinta',
        sexta: 'Sexta',
        sábado: 'Sábado'
    }

    return weekdayValueText[value];
}

const weekdays = [
    'segunda',
    'terça',
    'quarta',
    'quinta',
    'sexta',
    'sábado'
]

function toTimeFormat(number) {
    return (number).toLocaleString('pt-BR', {minimumIntegerDigits: 2, useGrouping:false});
}