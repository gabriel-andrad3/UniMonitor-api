const { noticeRepository, userRepository, subjectRepository } = require('../repositories');

async function getNotices(user) {
    const notices = await noticeRepository.getNotices(user.id);

    for (let notice of notices) {
        notice.author = await userRepository.getUserById(notice.author.id);
        notice.subject = await subjectRepository.getSubjectById(notice.subject.id);

        if (notice.subject.professor.id === notice.author.id) {
            notice.subject.professor = notice.author;
        }
        else {
            notice.subject.professor = await notice.userRepository.getUserById(notice.subject.professor.id);
        }
    }

    return notices;
}

module.exports = {
    getNotices,
}
