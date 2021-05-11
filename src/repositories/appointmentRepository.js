const pool = require('../../config/database');
const { Appointment, User, Schedule } = require('../models'); 

const selectQuery = `select 
                        a.id as appointment_id,
                        a."begin" as appointment_begin,
                        a."end" as appointment_end,
                        a.student_id as appointment_student_id,
                        a.schedule_id as appointment_schedule_id
                    from
                        appointment a`;

async function getAppointments() {
    let result = await pool.query(selectQuery);

    if (result.rowCount == 0)
        return [];

    return result.rows.map(row => {
        let student = new User(null, null, null, null, row.appointment_student_id);
        let schedule = new Schedule(null, null, null, null, row.appointment_schedule_id);

        return new Appointment(row.appointment_begin, row.appointment_end, student, schedule, row.appointment_id);
    })
}

async function getAppointmentsByScheduleId(scheduleId) {
    const query = selectQuery + `
        where a.schedule_id = ${scheduleId}
    `;

    let result = await pool.query(query);

    if (result.rowCount == 0)
        return [];

    return result.rows.map(row => {
        let student = new User(null, null, null, null, row.appointment_student_id);
        let schedule = new Schedule(null, null, null, null, row.appointment_schedule_id);

        return new Appointment(row.appointment_begin, row.appointment_end, student, schedule, row.appointment_id);
    })
}

async function getAppointmentById(id) {
    let query = `${selectQuery} where a.id = ${id}`;
    
    let result = await pool.query(query);

    if (result.rowCount == 0)
        return null;

    let student = new User(null, null, null, null, result.rows[0].appointment_student_id);
    let schedule = new Schedule(null, null, null, result.rows[0].appointment_schedule_id);

    return new Appointment(result.rows[0].appointment_begin, result.rows[0].appointment_end, student, schedule, result.rows[0].appointment_id);
}

async function insertAppointment(appointment) {
    const insertQuery = `insert into appointment 
                            ("begin", "end", student_id, schedule_id) 
                        values 
                            ('${appointment.begin}', '${appointment.end}', ${appointment.student.id}, ${appointment.schedule.id})
                        returning id`;

    let result = await pool.query(insertQuery);

    appointment.id = result.rows[0].id;

    return appointment; 
}

async function updateAppointment(appointment) {
    const updateQuery = `update appointment set 
                            "begin"='${appointment.begin}',
                            "end"='${appointment.end}',
                            student_id=${appointment.student.id}, 
                            schedule_id=${appointment.schedule.id} 
                        where 
                            id=${appointment.id}`;
    
    await pool.query(updateQuery);

    return appointment;
}

async function deleteAppointment(id) {
    const deleteQuery = `delete from appointment 
                        where id=${id}`;

    await pool.query(deleteQuery);
}

module.exports = {
    getAppointments, 
    getAppointmentsByScheduleId,
    getAppointmentById,
    insertAppointment,  
    updateAppointment,
    deleteAppointment  
}