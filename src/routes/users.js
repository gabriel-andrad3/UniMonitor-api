const express = require('express');
const userService = require('../services/userService');

const router = express.Router();

router.get('/', async function(req, res, next) {
  try {
    res.send(await userService.getUsers());
  }
  catch (error) {
    res.send(error);
  }
});

router.get('/:id', async function(req, res, next) {
  try {
    res.send(await userService.getUser(req.params.id));
  }
  catch (error) {
    res.send(error);
  }
});

module.exports = router;
