const pool = require('../../config/database');

async function insertEnrollment(user, subject) {
    const insertQuery = `insert into "enrollment" 
                            (student_id, subject_id) 
                        values 
                            (${user.id}, ${subject.id})`;

    await pool.query(insertQuery);
}

module.exports = {
    insertEnrollment, 
}