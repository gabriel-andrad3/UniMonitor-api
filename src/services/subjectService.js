const { Subject } = require('../models');
const subjectRepository = require('../repositories/subjectRepository');
const userRepository = require('../repositories/userRepository');
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
        throw new Conflict(`user with id ${professor.id} does not exist`);
    }

    let professorRole = existentUser.roles.find(role => role.name === 'Professor');

    if (!professorRole) {
        throw new Conflict(`user with id ${professor.id} must be a professor`); 
    }

    return await subjectRepository.insertSubject(new Subject(name, workload, existentUser));
}

async function updateSubject(id, name, workload, professor) {
    let existentSubject = await subjectRepository.getSubjectById(id);

    if (!existentSubject) {
        throw new NotFound(`subject with id ${id} does not exist`);
    }

    let existentUser = await userRepository.getUserById(professor.id);

    if (!existentUser) {
        throw new Conflict(`user with id ${role.id} does not exist`);
    }

    let professorRole = existentUser.roles.find(role => role.name === 'Professor');

    if (!professorRole) {
        throw new Conflict(`user with id ${role.id} must be a professor`);
    }
    
    return await subjectRepository.updateSubject(new Subject(name, workload, existentUser, id));
}

async function deleteSubject(id) {
    let existentSubject = await subjectRepository.getSubjectById(id);

    if (!existentSubject) {
        throw new NotFound(`subject with id ${id} does not exist`);
    }

    await subjectRepository.deleteSubject(existentSubject);
}

module.exports = {
    getSubjects,
    createSubject,
    updateSubject,
    deleteSubject
};
