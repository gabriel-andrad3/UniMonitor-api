const Schedule = require('../models/Schedule');
const scheduleRepository = require('../repositories/scheduleRepository');
const monitoringRepository = require('../repositories/monitoringRepository');
const subjectRepository = require('../repositories/subjectRepository');
const userRepository = require('../repositories/userRepository');
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
        throw new Conflict(`monitoring with id ${monitoring.id} does not exist`);
    }

    return await scheduleRepository.insertSchedule(new Schedule(weekday, begin, end, existentMonitoring));
}

async function updateSchedule(id, weekday, begin, end, monitoring) {
    let existentSchedule = await scheduleRepository.getScheduleById(id);

    if (!existentSchedule) {
        throw new NotFound(`schedule with id ${id} does not exist`);
    }

    let existentMonitoring = await monitoringRepository.getMonitoringById(monitoring.id); 

    if (!existentMonitoring) {
        throw new Conflict(`monitoring with id ${monitoring.id} does not exist`);
    }
    
    return await scheduleRepository.updateSchedule(new Schedule(weekday, begin, end, existentMonitoring, id));
}

async function deleteSchedule(id) {
    let existentSchedule = await scheduleRepository.getScheduleById(id);

    if (!existentSchedule) {
        throw new NotFound(`schedule with id ${id} does not exist`);
    }

    await scheduleRepository.deleteSchedule(existentSchedule);
}

module.exports = {
    getSchedules,
    createSchedule,
    updateSchedule,
    deleteSchedule
};
