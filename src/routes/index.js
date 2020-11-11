var express = require('express');
var router = express.Router();

const users = require('./users');
const roles = require('./roles');
const subjects = require('./subjects');

router.use('/users', users);
router.use('/roles', roles);
router.use('/subjects', subjects);

module.exports = router;
