const { Subject } = require('../models');
const { subjectRepository, userRepository } = require('../repositories');
const { NotFound, Conflict } = require('../utils/errors');

async function getSubjects() {
    let subjects = await subjectRepository.getSubjects();

    for (let subject of subjects) {
        if (subject.professor.id) {
            subject.professor = await userRepository.getUserById(subject.professor.id);
        }
    }

    return subjects;
}

async function createSubject(name, workload, professor) {
    let existentUser = await userRepository.getUserById(professor.id); 

    if (!existentUser) {
        throw new Conflict(`usuário com id ${professor.id} não existe`);
    }

    let professorRole = existentUser.roles.find(role => role.name === 'Professor');

    if (!professorRole) {
        throw new Conflict(`usuário com id ${professor.id} deve ser um professor`); 
    }

    return await subjectRepository.insertSubject(new Subject(name, workload, existentUser));
}

async function updateSubject(id, name, workload, professor) {
    let existentSubject = await subjectRepository.getSubjectById(id);

    if (!existentSubject) {
        throw new NotFound(`disciplina com id ${id} não existe`);
    }

    let existentUser = await userRepository.getUserById(professor.id);

    if (!existentUser) {
        throw new Conflict(`usuário com id ${role.id} não existe`);
    }

    let professorRole = existentUser.roles.find(role => role.name === 'Professor');

    if (!professorRole) {
        throw new Conflict(`usuário com id ${role.id} deve ser um professor`);
    }
    
    return await subjectRepository.updateSubject(new Subject(name, workload, existentUser, id));
}

async function deleteSubject(id) {
    let existentSubject = await subjectRepository.getSubjectById(id);

    if (!existentSubject) {
        throw new NotFound(`disciplina com id ${id} não existe`);
    }

    await subjectRepository.deleteSubject(existentSubject);
}

module.exports = {
    getSubjects,
    createSubject,
    updateSubject,
    deleteSubject
};
