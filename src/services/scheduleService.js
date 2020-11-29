const Schedule = require('../models/Schedule');
const { scheduleRepository, monitoringRepository, subjectRepository, userRepository } = require('../repositories');
const { NotFound, Conflict } = require('../utils/errors');

async function getSchedules() {
    let schedules = await scheduleRepository.getSchedules();


    for (let schedule of schedules) {
        if (schedule.monitoring.id) {
            schedule.monitoring = await monitoringRepository.getMonitoringById(schedule.monitoring.id);
            schedule.monitoring.subject = await subjectRepository.getSubjectById(schedule.monitoring.subject.id);
            schedule.monitoring.monitor = await userRepository.getUserById(schedule.monitoring.monitor.id);
        }
    }

    return schedules;
}

async function createSchedule(weekday, begin, end, monitoring) {
    let existentMonitoring = await monitoringRepository.getMonitoringById(monitoring.id); 

    if (!existentMonitoring) {
        throw new Conflict(`monitoria com id ${monitoring.id} não existe`);
    }

    return await scheduleRepository.insertSchedule(new Schedule(weekday, begin, end, existentMonitoring));
}

async function updateSchedule(id, weekday, begin, end, monitoring) {
    let existentSchedule = await scheduleRepository.getScheduleById(id);

    if (!existentSchedule) {
        throw new NotFound(`horário com id ${id} não existe`);
    }

    let existentMonitoring = await monitoringRepository.getMonitoringById(monitoring.id); 

    if (!existentMonitoring) {
        throw new Conflict(`monitoria com id ${monitoring.id} não existe`);
    }
    
    return await scheduleRepository.updateSchedule(new Schedule(weekday, begin, end, existentMonitoring, id));
}

async function deleteSchedule(id) {
    let existentSchedule = await scheduleRepository.getScheduleById(id);

    if (!existentSchedule) {
        throw new NotFound(`horário com id ${id} não existe`);
    }

    await scheduleRepository.deleteSchedule(existentSchedule);
}

module.exports = {
    getSchedules,
    createSchedule,
    updateSchedule,
    deleteSchedule
};
