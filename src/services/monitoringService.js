const Monitoring = require('../models/Monitoring');
const monitoringRepository = require('../repositories/monitoringRepository');
const subjectRepository = require('../repositories/subjectRepository');
const userRepository = require('../repositories/userRepository');
const { Conflict, NotFound } = require('../utils/errors');

async function getMonitorings() {
    let monitorings = await monitoringRepository.getMonitorings();

    for (let monitoring of monitorings) {
        if (monitoring.subject.id) {            
            monitoring.subject = await subjectRepository.getSubjectById(monitoring.subject.id);
            monitoring.subject.professor = await userRepository.getUserById(monitoring.subject.professor.id);
        }
        if (monitoring.monitor.id) {
            monitoring.monitor = await userRepository.getUserById(monitoring.monitor.id);
        }
    }

    return monitorings;
}

async function insertMonitoring(subject, monitor) {
    let existentSubject = await subjectRepository.getSubjectById(subject.id); 
    existentSubject.professor = await userRepository.getUserById(existentSubject.professor.id);

    if (!existentSubject) {
        throw new NotFound(`subject with id ${subject.id} does not exist`);
    }

    let existentMonitor = await userRepository.getUserById(monitor.id); 

    if (!existentMonitor) {
        throw new NotFound(`monitor with id ${monitor.id} does not exist`);
    }

    let monitorRole = existentMonitor.roles.find(role => role.name === "Monitor");

    if (!monitorRole) {
        throw new Conflict(`user with id ${monitor.id} must be a monitor`);
    }
    
    return await monitoringRepository.insertMonitoring(new Monitoring(existentSubject, existentMonitor));
}

async function updateMonitoring(subject, monitor, id) {
    let existentMonitoring = await monitoringRepository.getMonitoringById(id);

    if (!existentMonitoring) {
        throw new NotFound(`monitoring with id ${id} does not exist`);
    }

    let existentSubject = await subjectRepository.getSubjectById(subject.id); 
    existentSubject.professor = await userRepository.getUserById(existentSubject.professor.id);

    if (!existentSubject) {
        throw new NotFound(`subject with id ${subject.id} does not exist`);
    }

    let existentMonitor = await userRepository.getUserById(monitor.id); 

    if (!existentMonitor) {
        throw new NotFound(`monitor with id ${monitor.id} does not exist`);
    }

    let monitorRole = existentMonitor.roles.find(role => role.name === "Monitor");

    if (!monitorRole) {
        throw new Conflict(`user with id ${monitor.id} must be a monitor`);
    }
    
    return await monitoringRepository.updateMonitoring(new Monitoring(existentSubject, existentMonitor, id));
}

async function deleteMonitoring(id) {
    let existentMonitoring = await monitoringRepository.getMonitoringById(id);
    
    if (!existentMonitoring) {
        throw new NotFound(`monitoring with id ${id} does not exist`);
    }
    
    await monitoringRepository.deleteMonitoring(id);
}

module.exports = {
    getMonitorings,
    insertMonitoring,
    updateMonitoring,
    deleteMonitoring
}