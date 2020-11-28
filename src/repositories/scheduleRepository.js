const pool = require('../../config/database');
const { Subject, User } = require('../models');
const Schedule = require("../models/Schedule");

const selectQuery = `select 
                        s.id as schedule_id,
                        s."weekday" as schedule_weekday,
                        s.begin as schedule_begin,
                        s.end as schedule_end,
                        s.monitoring_id as schedule_monitoring_id
                    from
                        schedule s`;

async function getSchedules() {
    let result = await pool.query(selectQuery);

    if (result.rowCount == 0)
        return [];

    return result.rows.map(row => {
        let monitoring = new User(null, null, null, row.schedule_monitoring_id);

        return new Schedule(row.schedule_weekday.trim(), row.schedule_begin, row.schedule_end, monitoring, row.schedule_id);
    });
}

async function getScheduleById(id) {
    let query = `${selectQuery} where s.id = ${id}`;

    let result = await pool.query(query);

    if (result.rowCount == 0)
        return null;

    let monitoring = new User(null, null, null, result.rows[0].schedule_monitoring_id);

    return new Schedule(result.rows[0].schedule_weekday.trim(), result.rows[0].schedule_begin, result.rows[0].schedule_end, monitoring, result.rows[0].schedule_id);
}

async function insertSchedule(schedule) {
    const insertQuery = `insert into schedule 
                            ("weekday", "begin", "end", monitoring_id) 
                        values 
                            ('${schedule.weekday}', '${schedule.begin}', '${schedule.end}', '${schedule.monitoring.id}') 
                        returning id`;
    
    let result = await pool.query(insertQuery);
    
    schedule.id = result.rows[0].id;

    return schedule;
}

async function updateSchedule(schedule) {
    const updateQuery = `update schedule set 
                            "weekday"='${schedule.weekday}', 
                            "begin"='${schedule.begin}',
                            "end"='${schedule.end}', 
                            monitoring_id=${schedule.monitoring.id}
                        where
                            id = ${schedule.id}`;
    
    await pool.query(updateQuery);

    return schedule;
}

async function deleteSchedule(schedule) {
    const deleteQuery = `delete from schedule
                        where
                            id = '${schedule.id}'`;

    await pool.query(deleteQuery);
}

module.exports = {
    getSchedules,
    getScheduleById,
    insertSchedule,
    updateSchedule,
    deleteSchedule
}
