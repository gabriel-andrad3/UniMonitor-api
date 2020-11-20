const pool = require('../../config/database');
const { Subject, User } = require('../models');

const selectQuery = `select 
                        s.id as subject_id,
                        s."name" as subject_name,
                        s.workload as subject_workload,
                        s.professor_id as subject_professor_id
                    from
                        subject s`;

async function getSubjects() {
    let result = await pool.query(selectQuery);

    if (result.rowCount == 0)
        return [];

    return result.rows.map(row => {
        let professor = new User(null, null, null, row.subject_professor_id);

        return new Subject(row.subject_name.trim(), row.subject_workload, professor, row.subject_id);
    });
}

async function getSubjectById(id) {
    let query = `${selectQuery} where s.id = ${id}`;

    let result = await pool.query(query);

    if (result.rowCount == 0)
        return null;

    let professor = new User(null, null, null, result.rows[0].subject_professor_id);

    return new Subject(result.rows[0].subject_name.trim(), result.rows[0].subject_workload, professor, result.rows[0].subject_id);
}

async function insertSubject(subject) {
    const insertQuery = `insert into subject 
                            ("name", workload, professor_id) 
                        values 
                            ('${subject.name}', '${subject.workload}', '${subject.professor.id}') 
                        returning id`;
    
    let result = await pool.query(insertQuery);
    
    subject.id = result.rows[0].id;

    return subject;
}

async function updateSubject(subject) {
    const updateQuery = `update subject set 
                            "name"='${subject.name}', 
                            workload=${subject.workload}, 
                            professor_id=${subject.professor.id}
                        where
                            id = ${subject.id}`;
    
    await pool.query(updateQuery);

    return subject;
}

async function deleteSubject(subject) {
    const deleteQuery = `delete from subject
                        where
                            id = '${subject.id}'`;

    await pool.query(deleteQuery);
}

module.exports = {
    getSubjects,
    getSubjectById,
    insertSubject,
    updateSubject,
    deleteSubject
}
