var express = require('express');
var router = express.Router();

const appointments = require('./appointments');
const monitorings = require('./monitorings');
const notices = require('./notices');
const roles = require('./roles');
const schedules = require('./schedules');
const sessions = require('./sessions');
const subjects = require('./subjects');
const users = require('./users');

router.use('/appointments', appointments);
router.use('/monitorings', monitorings);
router.use('/notices', notices);
router.use('/roles', roles);
router.use('/schedules', schedules);
router.use('/sessions', sessions);
router.use('/subjects', subjects);
router.use('/users', users);

module.exports = router;
