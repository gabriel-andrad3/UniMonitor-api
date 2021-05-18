const express = require('express');
const router = express.Router();
const { validateName, validateWorkload, validateProfessor } = require('../validations/subjectValidation');
const subjectService = require('../services/subjectService');
const handleRoleAuthorization = require('../middlewares/handleAuthorization');

router.get('/', handleRoleAuthorization(['Student', 'Monitor', 'Professor', 'Admin']), async function(req, res, next) {
    try {
      res.send(await subjectService.getSubjects(req.query.userId));
    }
    catch (error) {
        next(error);
    }
});

router.post('/', handleRoleAuthorization(['Admin']), async function(req, res, next) {
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

router.put('/:id', handleRoleAuthorization(['Admin']), async function(req, res, next) {
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

router.delete('/:id', handleRoleAuthorization(['Admin']), async function(req, res, next) {
  try {
    res.send(await subjectService.deleteSubject(req.params.id));
  }
  catch (error) {
    next(error);
  }
});

router.put('/:id/users', async function(req, res, next) {
  try {
    res.send(await subjectService.upsertUsers(req.params.id, req.files.enrollments));
  }
  catch (error) {
    next(error);
  }
});

module.exports = router;
