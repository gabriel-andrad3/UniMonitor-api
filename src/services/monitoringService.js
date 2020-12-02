const Monitoring = require('../models/Monitoring');
const { monitoringRepository, subjectRepository, userRepository } = require('../repositories');
const { Conflict, NotFound } = require('../utils/errors');
const scheduleService = require('./scheduleService');

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
        throw new NotFound(`disciplina com id ${subject.id} não existe`);
    }

    let existentMonitor = await userRepository.getUserById(monitor.id); 

    if (!existentMonitor) {
        throw new NotFound(`monitor com id ${monitor.id} não existe`);
    }

    let monitorRole = existentMonitor.roles.find(role => role.name === "Monitor");

    if (!monitorRole) {
        throw new Conflict(`usuário com id ${monitor.id} deve ser um monitor`);
    }

    const monitorings = await getMonitorings();
    const equalMonitoring = monitorings.find(monitoring => (monitoring.monitor.id == monitor.id) && (monitoring.subject.id == subject.id));
    
    if (equalMonitoring) {
        throw new Conflict(`monitoria já cadastrada`);
    }

    return await monitoringRepository.insertMonitoring(new Monitoring(existentSubject, existentMonitor));
}

async function updateMonitoring(subject, monitor, id) {
    let existentMonitoring = await monitoringRepository.getMonitoringById(id);

    if (!existentMonitoring) {
        throw new NotFound(`monitoria com id ${id} não existe`);
    }

    let existentSubject = await subjectRepository.getSubjectById(subject.id); 
    existentSubject.professor = await userRepository.getUserById(existentSubject.professor.id);

    if (!existentSubject) {
        throw new NotFound(`disciplina com id ${subject.id} não existe`);
    }

    let existentMonitor = await userRepository.getUserById(monitor.id); 

    if (!existentMonitor) {
        throw new NotFound(`monitor com id ${monitor.id} não existe`);
    }

    let monitorRole = existentMonitor.roles.find(role => role.name === "Monitor");

    if (!monitorRole) {
        throw new Conflict(`usuário com id ${monitor.id} deve ser um monitor`);
    }

    const monitorings = await getMonitorings();
    const equalMonitoring = monitorings.find(monitoring => (monitoring.monitor.id == monitor.id) && (monitoring.subject.id == subject.id));
    
    if (equalMonitoring) {
        throw new Conflict(`monitoria já cadastrada`);
    }
    
    return await monitoringRepository.updateMonitoring(new Monitoring(existentSubject, existentMonitor, id));
}

async function deleteMonitoring(id) {
    let existentMonitoring = await monitoringRepository.getMonitoringById(id);
    
    if (!existentMonitoring) {
        throw new NotFound(`monitoria com id ${id} não existe`);
    }
    
    const schedules = await scheduleService.getSchedules();
    const existentSchedule = schedules.find(schedule => schedule.monitoring.id == id);
    
    if (existentSchedule) {
        throw new Conflict(`existe horário de id ${existentSchedule.id} cadastrada para essa monitoria`);
    }

    await monitoringRepository.deleteMonitoring(id);
}

module.exports = {
    getMonitorings,
    insertMonitoring,
    updateMonitoring,
    deleteMonitoring
}