const express = require('express');
const router = express.Router();
const handleRoleAuthorization = require('../middlewares/handleAuthorization');

const noticeService = require('../services/noticeService');

router.get('/', handleRoleAuthorization(['Student', 'Monitor', 'Professor', 'Admin']), async function(req, res, next) {
    try {
        res.send(await noticeService.getNotices(req.user));
    }
    catch (error) {
        next(error);
    }
});

module.exports = router;
