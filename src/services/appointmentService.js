const Appointment = require('../models/Appointment');
const { userRepository, subjectRepository, monitoringRepository, 
        appointmentRepository, scheduleRepository } = require('../repositories');

async function getAppointments() {
    let appointments = await appointmentRepository.getAppointments();
    
    for (let appointment of appointments) {
        if (appointment.student.id) {
            appointment.student = await userRepository.getUserById(appointment.student.id);
        }
        if (appointment.schedule.id) {
            appointment.schedule = await scheduleRepository.getScheduleById(appointment.schedule.id);
            appointment.schedule.monitoring = await monitoringRepository.getMonitoringById(appointment.schedule.monitoring.id);
            appointment.schedule.monitoring.subject = await subjectRepository.getSubjectById(appointment.schedule.monitoring.subject.id);
            appointment.schedule.monitoring.monitor = await userRepository.getUserById(appointment.schedule.monitoring.monitor.id);
        }
    }

    return appointments;
}

async function getAppointmentsByDate(begin, end, userId) {
    const beginDate = new Date(begin);
    const endDate = new Date(end);

    let schedules = await scheduleRepository.getSchedulesByMonitorId(userId);

    schedules = schedules.filter(x => x.monitoring.monitor.id === userId);

    for (let schedule of schedules) {
        if (schedule.monitoring.id) {
            schedule.monitoring = await monitoringRepository.getMonitoringById(schedule.monitoring.id);
            schedule.monitoring.subject = await subjectRepository.getSubjectById(schedule.monitoring.subject.id);
            schedule.monitoring.monitor = await userRepository.getUserById(schedule.monitoring.monitor.id);
        }
    }

    const groupedSchedules = [];

    const dateCount = new Date(beginDate);

    while (dateCount <= endDate) {
        const schedulesWeekday = schedules.filter(schedule => schedule.weekday === dateCount.getDay());

        if (schedulesWeekday.length > 0) {
            const date = new Date(dateCount);
            date.setHours(12, 0, 0 ,0);

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

                    if (bookedAppointment) {
                        let status = begin > new Date() ? 'booked' : 'past';
                        
                        bookedAppointment.student = await userRepository.getUserById(bookedAppointment.student.id);

                        appointments.push({...bookedAppointment, status: status, schedule: null });
                    }

                    timeCount.setMinutes(timeCount.getMinutes() + 30, 0, 0);
                }

                const bookedAppointmentsCount = appointments.filter(x => x.status === 'booked').length;
                const pastAppointmentsCount = appointments.filter(x => x.status === 'past').length;

                let scheduleStatus = '';
    
                if (bookedAppointmentsCount > 0) {
                    scheduleStatus = 'booked';
                }

                if (pastAppointmentsCount > 0) {
                    scheduleStatus = 'past';
                }
                
                if (scheduleStatus !== '') {
                    schedule.appointments = appointments;

                    groupedSchedule.schedules.push({...schedule, status: scheduleStatus})
                }
            }

            if (groupedSchedule.schedules.length > 0) {
                groupedSchedules.push(groupedSchedule);
            }
        }

        dateCount.setDate(dateCount.getDate() + 1);
    }

    return groupedSchedules;
}


async function insertAppointment(begin, end, student, schedule) {
    let existentStudent = await userRepository.getUserById(student.id);     

    if (!existentStudent) {
        throw new NotFound(`aluno com id ${student.id} não existe`);
    }

    let existentSchedule = await scheduleRepository.getScheduleById(schedule.id);
    let monitoring = await monitoringRepository.getMonitoringById(existentSchedule.monitoring.id);
    existentSchedule.monitoring.subject = await subjectRepository.getSubjectById(monitoring.subject.id);
    existentSchedule.monitoring.monitor = await userRepository.getUserById(monitoring.monitor.id);

    if (!existentSchedule) {
        throw new NotFound(`horário com id ${schedule.id} não existe`);
    }    
    
    return await appointmentRepository.insertAppointment(new Appointment(begin, end, existentStudent, existentSchedule));
}

async function updateAppointment(begin, end, student, schedule, id) {
    let existentAppointment = await appointmentRepository.getAppointmentById(id);     

    if (!existentAppointment) {
        throw new NotFound(`agendamento com id ${id} não existe`);
    }

    let existentStudent = await userRepository.getUserById(student.id);     

    if (!existentStudent) {
        throw new NotFound(`aluno com id ${student.id} não existe`);
    }

    let existentSchedule = await scheduleRepository.getScheduleById(schedule.id);
    let monitoring = await monitoringRepository.getMonitoringById(existentSchedule.monitoring.id);
    existentSchedule.monitoring.subject = await subjectRepository.getSubjectById(monitoring.subject.id);
    existentSchedule.monitoring.monitor = await userRepository.getUserById(monitoring.monitor.id);

    if (!existentSchedule) {
        throw new NotFound(`horário com id ${schedule.id} não existe`);
    }    
    
    return await appointmentRepository.updateAppointment(new Appointment(begin, end, existentStudent, existentSchedule, id));
}

async function deleteAppointment(id) {
    let existentAppointment = await appointmentRepository.getAppointmentById(id);
    
    if (!existentAppointment) {
        throw new NotFound(`agendamento com id ${id} não existe`);
    }
    
    await appointmentRepository.deleteAppointment(id);
}

module.exports = {
    getAppointments,
    getAppointmentsByDate,
    insertAppointment,
    updateAppointment,
    deleteAppointment
}