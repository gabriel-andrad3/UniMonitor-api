const Appointment = require('../models/Appointment');
const { userRepository, subjectRepository, monitoringRepository, appointmentRepository, scheduleRepository } = require('../repositories');

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
        throw new NotFound(`appointment with id ${id} does not exist`);
    }
    
    await appointmentRepository.deleteAppointment(id);
}

module.exports = {
    getAppointments,
    insertAppointment,
    updateAppointment,
    deleteAppointment
}