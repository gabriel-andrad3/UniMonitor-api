const { Notice, NoticeBoardWeekday } = require('../models');
const { noticeRepository, userRepository, subjectRepository, monitoringRepository } = require('../repositories');
const { Conflict, Forbidden } = require('../utils/errors');

async function getNotices(userId) {
    const notices = await noticeRepository.getNotices(userId);

    for (let notice of notices) {
        notice.author = await userRepository.getUserById(notice.author.id);
        notice.subject = await subjectRepository.getSubjectById(notice.subject.id);

        if (notice.subject.professor.id === notice.author.id) {
            notice.subject.professor = notice.author;
        }
        else {
            notice.subject.professor = await userRepository.getUserById(notice.subject.professor.id);
        }
    }

    const groupedNotices = notices.reduce((acc, notice) => {
        const noticeBoardWeekday = acc.find(x => x.date.toDateString() === notice.date.toDateString());

        if (noticeBoardWeekday) {
            noticeBoardWeekday.notices.push(notice);
        }
        else {
            let date = new Date(notice.date.getTime());
            date.setHours(0, 0, 0, 0);

            acc.push(new NoticeBoardWeekday(notice.date.getDay(), date, [notice]));
        }

        return acc;
    }, [])

    return groupedNotices;
}

async function createNotice(title, body, subjectId, userId) {
    const subject = await subjectRepository.getSubjectById(subjectId);

    if (!subject) {
        throw new NotFound(`disciplina com id ${subjectId} não existe`);
    }

    const isProfessor = subject.professor.id === userId;
    let isMonitor = false;

    if (!isProfessor) {
        const monitoring = await monitoringRepository.getMonitoringBySubjectId(subject.id);

        isMonitor = monitoring ? monitoring.monitor.id === userId : false;
    }

    if (!(isProfessor || isMonitor)) {
        throw new Forbidden(`usuário não é monitor nem professor da disciplina com id ${subjectId}`);
    }

    const author = await userRepository.getUserById(userId);

    return await noticeRepository.createNotice(new Notice(title, body, new Date().toUTCString(), author, subject));
}

module.exports = {
    getNotices,
    createNotice,
}
