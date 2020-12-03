const express = require('express');
const router = express.Router();
const appointmentService = require('../services/appointmentService');
const { validateStudent, validateSchedule } = require('../validations/appointmentValidation');
const handleRoleAuthorization = require('../middlewares/handleAuthorization');

router.get('/', handleRoleAuthorization(['Student', 'Monitor', 'Professor', 'Admin']), async function(req, res, next) {
    try {
        res.send(await appointmentService.getAppointments());
    }
    catch (error) {
        next(error);
    }
});

router.post('/', handleRoleAuthorization(['Student']), async function(req, res, next) {
    try {
        validateStudent(req.body.student);
        validateSchedule(req.body.schedule);
        
        res.send(await appointmentService.insertAppointment(req.body.begin, req.body.end, req.body.student, req.body.schedule));
    }
    catch (error) {
        next(error);
    }
});

router.put('/:id', handleRoleAuthorization(['Student']), async function(req, res, next) {
    try {
        validateStudent(req.body.student);
        validateSchedule(req.body.schedule);
        
        res.send(await appointmentService.updateAppointment(req.body.begin, req.body.end, req.body.student, req.body.schedule, req.params.id));
    }
    catch (error) {
        next(error);
    }
});

router.delete('/:id', handleRoleAuthorization(['Student']), async function(req, res, next) {
    try {
        res.send(await appointmentService.deleteAppointment(req.params.id));
    }
    catch (error) {
        next(error);
    }
});

module.exports = router;
