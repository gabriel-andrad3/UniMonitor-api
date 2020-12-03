const express = require('express');
const router = express.Router();
const monitoringService = require('../services/monitoringService');
const { validateSubject, validateMonitor } = require('../validations/monitoringValidation');
const handleRoleAuthorization = require('../middlewares/handleAuthorization');

router.get('/', handleRoleAuthorization(['Student', 'Monitor', 'Professor', 'Admin']), async function(req, res, next) {
    try {
        res.send(await monitoringService.getMonitorings());
    }
    catch (error) {
        next(error);
    }
});

router.post('/', handleRoleAuthorization(['Professor', 'Admin']), async function(req, res, next) {
    try {
        validateSubject(req.body.subject);
        validateMonitor(req.body.monitor);
        
        res.send(await monitoringService.insertMonitoring(req.body.subject, req.body.monitor));
    }
    catch (error) {
        next(error);
    }
});

router.put('/:id', handleRoleAuthorization(['Professor', 'Admin']), async function(req, res, next) {
    try {
        validateSubject(req.body.subject);
        validateMonitor(req.body.monitor);
        
        res.send(await monitoringService.updateMonitoring(req.body.subject, req.body.monitor, req.params.id));
    }
    catch (error) {
        next(error);
    }
});

router.delete('/:id', handleRoleAuthorization(['Professor', 'Admin']), async function(req, res, next) {
    try {
        res.send(await monitoringService.deleteMonitoring(req.params.id));
    }
    catch (error) {
        next(error);
    }
});

module.exports = router;