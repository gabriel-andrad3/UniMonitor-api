var express = require('express');
var router = express.Router();

const users = require('./users');
const roles = require('./roles');
const subjects = require('./subjects');
const monitorings = require('./monitorings');

router.use('/users', users);
router.use('/roles', roles);
router.use('/subjects', subjects);
router.use('/monitorings', monitorings);

module.exports = router;
