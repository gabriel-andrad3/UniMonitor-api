const express = require('express');
const router = express.Router();
const handleRoleAuthorization = require('../middlewares/handleAuthorization');

const noticeService = require('../services/noticeService');
const { validateTitle, validateBody, validateSubjectId } = require('../validations/noticeValidation');

router.get('/', handleRoleAuthorization(['Student', 'Monitor', 'Professor', 'Admin']), async function(req, res, next) {
    try {
        res.send(await noticeService.getNotices(req.user.id));
    }
    catch (error) {
        next(error);
    }
});

router.post('/', handleRoleAuthorization(['Monitor', 'Professor']), async function(req, res, next) {
    try {
        validateTitle(req.body.title);
        validateBody(req.body.body);
        validateSubjectId(req.body.subjectId);

        res.send(await noticeService.createNotice(req.body.title, req.body.body, req.body.subjectId, req.user.id));
    }
    catch (error) {
        next(error);
    }
});

module.exports = router;
