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

function translateWeekdayFromIndex(index) {
    const weekdays = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

    return weekdays[index];
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

function fixDateTimezone(date) {
    let userTimezoneOffset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() + userTimezoneOffset);
}
