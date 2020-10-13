const express = require('express');
const router = express.Router();

const roleService = require('../services/roleService');

router.get('/', async function(req, res, next) {
    try {
        res.send(await roleService.getRoles());
    }
    catch (error) {
        next(error);
    }
});

module.exports = router;
