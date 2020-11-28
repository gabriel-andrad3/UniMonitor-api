const express = require('express');
const router = express.Router();
const appointmentService = require('../services/appointmentService');

router.get('/', async function(req, res, next) {
    try {
        res.send(await appointmentService.getAppointments());
    }
    catch (error) {
        next(error);
    }
});

router.post('/', async function(req, res, next) {
    try {
        // validate begin end
        //validateStudent(req.body.student);
        //validateSchedule(req.body.schedule);
        
        res.send(await appointmentService.insertAppointment(req.body.begin, req.body.end, req.body.student, req.body.schedule));
    }
    catch (error) {
        next(error);
    }
});

router.put('/:id', async function(req, res, next) {
    try {
        // validate begin end
        //validateStudent(req.body.student);
        //validateSchedule(req.body.schedule);
        
        res.send(await appointmentService.updateAppointment(req.body.begin, req.body.end, req.body.student, req.body.schedule, req.params.id));
    }
    catch (error) {
        next(error);
    }
});

router.delete('/:id', async function(req, res, next) {
    try {
        res.send(await appointmentService.deleteAppointment(req.params.id));
    }
    catch (error) {
        next(error);
    }
});

module.exports = router;