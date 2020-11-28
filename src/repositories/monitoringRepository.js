const pool = require("../../config/database");
const { Subject, User, Monitoring } = require("../models");

const selectQuery = `select 
                        m.id as monitoring_id, 
                        m.subject_id as subject_id, 
                        m.monitor_id as monitor_id
                    from 
                        monitoring m`;

async function getMonitorings() {
    let result = await pool.query(selectQuery);

    if (result.rowCount == 0)
        return [];

    return result.rows.map(row => {
        let subject = new Subject(null, null, null, row.subject_id);
        let monitor = new User (null, null, null, row.monitor_id);        

        return new Monitoring(subject, monitor, row.monitoring_id);
    }); 
}

async function getMonitoringById(id) {
    let query = `${selectQuery} where m.id = ${id}`;
    
    let result = await pool.query(query);

    if (result.rowCount == 0)
        return null;

    let subject = new Subject(null, null, null, result.rows[0].subject_id);
    let monitor = new User (null, null, null, result.rows[0].monitor_id);        

    return new Monitoring(subject, monitor, result.rows[0].monitoring_id); 
}

async function insertMonitoring(monitoring) {
    const insertQuery = `insert into monitoring 
                            (subject_id, monitor_id) 
                        values 
                            (${monitoring.subject.id}, ${monitoring.monitor.id})
                        returning id`;

    let result = await pool.query(insertQuery);

    monitoring.id = result.rows[0].id;

    return monitoring; 
}

async function updateMonitoring(monitoring) {
    const updateQuery = `update monitoring set 
                            subject_id=${monitoring.subject.id}, 
                            monitor_id=${monitoring.monitor.id} 
                        where 
                            id=${monitoring.id}`;
    
    await pool.query(updateQuery);

    return monitoring;
}

async function deleteMonitoring(id) {
    const deleteQuery = `delete from monitoring 
                        where id=${id}`;

    await pool.query(deleteQuery);
}

module.exports = {
    getMonitorings,
    getMonitoringById,
    insertMonitoring,
    updateMonitoring,
    deleteMonitoring
}