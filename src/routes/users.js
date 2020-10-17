const express = require('express');
const userService = require('../services/userService');
const { validateName, validateRegister, validateRoles } = require('../validations/userValidation');

const router = express.Router();

router.get('/', async function(req, res, next) {
  try {
    res.send(await userService.getUsers());
  }
  catch (error) {
    next(error);
  }
});

router.get('/:id', async function(req, res, next) {
  try {
    res.send(await userService.getUser(req.params.id));
  }
  catch (error) {
    next(error);
  }
});

router.post('/', async function(req, res, next) {
  try {
    validateName(req.body.name);
    validateRegister(req.body.register);
    validateRoles(req.body.roles);

    res.send(await userService.createUser(req.body.name, req.body.register, req.body.roles));
  }
  catch (error) {
    next(error);
  }
});

module.exports = router;
