const { Appointment } = require('../models');
const Schedule = require('../models/Schedule');
const { scheduleRepository, monitoringRepository, subjectRepository, userRepository, appointmentRepository } = require('../repositories');
const { NotFound, Conflict } = require('../utils/errors');
const appointmentService = require('./appointmentService');

async function getSchedules(monitoringId) {
    let schedules = []; 
    
    if (monitoringId) {
        schedules = await scheduleRepository.getSchedulesByMonitoringId(monitoringId);
    } else {
        schedules = await scheduleRepository.getSchedules();
    }    

    for (let schedule of schedules) {
        if (schedule.monitoring.id) {
            schedule.monitoring = await monitoringRepository.getMonitoringById(schedule.monitoring.id);
            schedule.monitoring.subject = await subjectRepository.getSubjectById(schedule.monitoring.subject.id);
            schedule.monitoring.monitor = await userRepository.getUserById(schedule.monitoring.monitor.id);
        }
    }

    return schedules;
}

async function getSchedulesByDate(begin, end, userId) {   
    const beginDate = new Date(begin);
    const endDate = new Date(end);

    let schedules = await scheduleRepository.getSchedulesByUserId(userId);

    for (let schedule of schedules) {
        if (schedule.monitoring.id) {
            schedule.monitoring = await monitoringRepository.getMonitoringById(schedule.monitoring.id);
            schedule.monitoring.subject = await subjectRepository.getSubjectById(schedule.monitoring.subject.id);
            schedule.monitoring.monitor = await userRepository.getUserById(schedule.monitoring.monitor.id);
        }
    }

    const groupedSchedules = [];

    const dateCount = new Date(beginDate);

    const user = await userRepository.getUserById(userId);
    const isProfessor = user.roles.filter(x => x.name === 'Professor').length > 0;

    while (dateCount <= endDate) {
        console.log(dateCount)

        const schedulesWeekday = schedules.filter(schedule => schedule.weekday === dateCount.getDay());

        if (schedulesWeekday.length > 0) {
            const date = new Date(dateCount);
            date.setHours(0, 0, 0 ,0);

            const groupedSchedule =  {
                date: date,
                schedules: []
            }

            for (const schedule of schedulesWeekday) {
                const timeCount = new Date(dateCount);
                const beginParts = schedule.begin.split(':');
                timeCount.setHours(beginParts[0], beginParts[1], 0, 0);

                const scheduleEnd = new Date(dateCount);
                const endParts = schedule.end.split(':');
                scheduleEnd.setHours(endParts[0], endParts[1], 0, 0);

                const appointments = [];

                const bookedAppointments = await appointmentRepository.getAppointmentsByScheduleId(schedule.id);

                while (timeCount < scheduleEnd) {
                    const begin = new Date(timeCount);
                    const end = new Date(begin);
                    end.setMinutes(end.getMinutes() + 30);

                    let bookedAppointment = bookedAppointments.find(
                        x => new Date(x.begin).getTime() === begin.getTime() && new Date(x.end).getTime() === end.getTime());

                    let status = begin > new Date() ? 'available' : 'past'; 

                    if (bookedAppointment) {
                        if (status !== 'past') {
                            status = bookedAppointment.student.id === userId ? 'booked' : 'unavailable';
                        }

                        if (status === 'unavailable' && isProfessor) {
                            bookedAppointment.student = await userRepository.getUserById(bookedAppointment.student.id);
                        }

                        appointments.push({...bookedAppointment, status: status, schedule: null });
                    }
                    else {
                        appointments.push({ begin: begin, end: end, status: status, student: null });
                    }

                    timeCount.setMinutes(timeCount.getMinutes() + 30, 0, 0);
                }

                const availableAppointmentsCount = appointments.filter(x => x.status === 'available').length;
                const bookedAppointmentsCount = appointments.filter(x => x.status === 'booked').length;
                const pastAppointmentsCount = appointments.filter(x => x.status === 'past').length;
                const unavailableAppointmentsCount = appointments.filter(x => x.status === 'unavailable').length;

                let scheduleStatus = '';

                if (isProfessor) {
                    if (unavailableAppointmentsCount > 0) {
                        scheduleStatus = 'withBooking';
                    }
                    else {
                        scheduleStatus = 'available';
                    }
    
                    if (pastAppointmentsCount > 0) {
                        scheduleStatus = 'past';
                    }
                }
                else {
                    if (availableAppointmentsCount > 0) {
                        scheduleStatus = 'available';
                    }
                    else {
                        scheduleStatus = 'unavailable';
                    }
    
                    if (bookedAppointmentsCount > 0) {
                        scheduleStatus = 'booked';
                    }
    
                    if (pastAppointmentsCount > 0) {
                        scheduleStatus = 'past';
                    }
                }
                
                schedule.appointments = appointments;

                groupedSchedule.schedules.push({...schedule, status: scheduleStatus})
            }

            groupedSchedules.push(groupedSchedule);
        }

        dateCount.setDate(dateCount.getDate() + 1);
    }

    return groupedSchedules;
}

async function createSchedule(weekday, begin, end, monitoring) {
    let existentMonitoring = await monitoringRepository.getMonitoringById(monitoring.id); 

    if (!existentMonitoring) {
        throw new Conflict(`monitoria com id ${monitoring.id} não existe`);
    }

    const schedules = await getSchedules();
    const equalSchedule = schedules.find(schedule => (schedule.weekday == weekday) && (schedule.begin == begin) && (schedule.end == end));
    
    if (equalSchedule) {
        throw new Conflict(`horário já cadastrado`);
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

    const appointments = await appointmentService.getAppointments();
    const existentAppointment = appointments.find(appointment => appointment.schedule.id == id);
    
    if (existentAppointment) {
        throw new Conflict(`existe agendamento de id ${existentAppointment.id} cadastrada para esse horário`);
    }

    await scheduleRepository.deleteSchedule(existentSchedule);
}

module.exports = {
    getSchedules,
    getSchedulesByDate,
    createSchedule,
    updateSchedule,
    deleteSchedule
};
