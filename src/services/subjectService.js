const { Subject, User, Role } = require('../models');
const { subjectRepository, userRepository, enrollmentRepository, roleRepository } = require('../repositories');
const { NotFound, Conflict } = require('../utils/errors');
const monitoringService = require('./monitoringService');

const csv = require('csv-parser');
const { Readable } = require('stream');

async function getSubjects(userId) {
    let subjects = [];

    if (userId) {
        subjects.push(...await subjectRepository.getSubjectsByProfessorId(userId));
        subjects.push(...await subjectRepository.getSubjectsByMonitorId(userId));
    }
    else {
        subjects = await subjectRepository.getSubjects();
    }

    if (subjects.length === 0) {
        return [];
    }

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
    
    const monitorings = await monitoringService.getMonitorings();
    const existentMonitoring = monitorings.find(monitoring => monitoring.subject.id == id);
    
    if (existentMonitoring) {
        throw new Conflict(`existe monitoria de id ${existentMonitoring.id} cadastrada para essa disciplina`);
    }

    await subjectRepository.deleteSubject(existentSubject);
}

function bufferToStream(binary) {
    const readableInstanceStream = new Readable({
      read() {
        this.push(binary);
        this.push(null);
      }
    });

    return readableInstanceStream;
}

async function upsertUsers(id, usersFile) {
    const rows = [];

    bufferToStream(usersFile.data)
        .pipe(csv())
        .on('data', (row) => {
            rows.push(row);
        })
        .on('end', async () => {
            const existentRoles = await roleRepository.getRoles();
            const studentRole = existentRoles.find(x => x.name === 'Student');
            
            const users = rows.map(row => new User(row.name, row.register, [studentRole], row.email));

            for (let user of users) {
                const userFound = await userRepository.getUserByRegister(user.register);

                user.id = userFound?.id;

                if (!userFound) {
                    const userInserted = await userRepository.insertUserWithoutPassowrd(user);

                    user.id = userInserted.id;
                }
                else if (!userFound.email) {
                    await userRepository.updateUserEmail(user)
                }

                await enrollmentRepository.insertEnrollment(user, new Subject(null, null, null, id));
            }
        });
}

module.exports = {
    getSubjects,
    createSubject,
    updateSubject,
    deleteSubject,
    upsertUsers
};
