const express = require('express');
const router = express.Router();
const { validateName, validateWorkload, validateProfessor } = require('../validations/subjectValidation');

const subjectService = require('../services/subjectService');

router.get('/', async function(req, res, next) {
    try {
        res.send(await subjectService.getSubjects());
    }
    catch (error) {
        next(error);
    }
});

router.post('/', async function(req, res, next) {
    try {
      validateName(req.body.name);
      validateWorkload(req.body.workload);
      validateProfessor(req.body.professor);
  
      res.send(await subjectService.createSubject(req.body.name, req.body.workload, req.body.professor));
    }
    catch (error) {
      next(error);
    }
});

router.put('/:id', async function(req, res, next) {
  try {
    validateName(req.body.name);
    validateWorkload(req.body.workload);
    validateProfessor(req.body.professor);

    res.send(await subjectService.updateSubject(req.params.id, req.body.name, req.body.workload, req.body.professor));
  }
  catch (error) {
    next(error);
  }
});

router.delete('/:id', async function(req, res, next) {
  try {
    res.send(await subjectService.deleteSubject(req.params.id));
  }
  catch (error) {
    next(error);
  }
});

module.exports = router;
