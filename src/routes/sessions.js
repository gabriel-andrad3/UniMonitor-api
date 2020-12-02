const express = require('express');
const router = express.Router();
const sessionService = require('../services/sessionService');
const { validateRegister, validatePassword } = require('../validations/sessionsValidation');

router.post('/', async function(req, res, next) {
  try {
    validateRegister(req.body.register);
    validatePassword(req.body.password);

    res.send(await sessionService.createSession(req.body.register, req.body.password));
  }
  catch (error) {
    next(error);
  }
});

module.exports = router;
