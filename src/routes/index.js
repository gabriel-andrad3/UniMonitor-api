var express = require('express');
var router = express.Router();

const users = require('./users');
const roles = require('./roles');
const subjects = require('./subjects');
const monitorings = require('./monitorings');
const appointments = require('./appointments');
const schedules = require('./schedules');

router.use('/users', users);
router.use('/roles', roles);
router.use('/subjects', subjects);
router.use('/monitorings', monitorings);
router.use('/appointments', appointments);
router.use('/schedules', schedules);

module.exports = router;
