const pool = require('../../config/database');
const { Subject, User } = require('../models');
const Notice = require('../models/Notice');

async function getNotices(userId) {
    const selectQuery = `
        select 
            n.id as notice_id,
            n.title as notice_title,
            n.body as notice_body,
            n."date" as notice_post_date,
            n.author_id as author_id,
            n.subject_id as subject_id
        from "notice" n 
            inner join subject s on s.id = n.subject_id 
            inner join enrollment e on e.subject_id = n.subject_id 
        where 
            n.author_id = ${userId} or 
            e.student_id = ${userId}
        `

    const result = await pool.query(selectQuery);

    if (result.rowCount == 0)
        return [];
    
    return result.rows.map(row => {
        let subject = new Subject(null, null, null, row.subject_id);
        let author = new User(null, null, null, null, row.author_id);

        return new Notice(row.notice_title.trim(), row.notice_body.trim(), row.notice_post_date, author, subject, row.notice_id);
    });
}

async function createNotice(notice) {
    const insertQuery = `insert into notice 
                            (title, body, author_id, "date", subject_id)
                        values 
                            ('${notice.title}', '${notice.body}', ${notice.author.id}, '${notice.date}', ${notice.subject.id}) 
                        returning id`;
    
    let result = await pool.query(insertQuery);
    
    notice.id = result.rows[0].id;

    return notice;
}

module.exports = {
    getNotices,
    createNotice
}
