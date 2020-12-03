const express = require('express');
const router = express.Router();
const handleRoleAuthorization = require('../middlewares/handleAuthorization');

const roleService = require('../services/roleService');

router.get('/', handleRoleAuthorization(['Student', 'Monitor', 'Professor', 'Admin']), async function(req, res, next) {
    try {
        res.send(await roleService.getRoles());
    }
    catch (error) {
        next(error);
    }
});

module.exports = router;
