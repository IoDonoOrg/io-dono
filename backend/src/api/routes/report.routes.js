const express = require('express');
const reportController = require('../controllers/report.controller');
const { isAuth, isAdmin } = require('../../middleware/auth.middleware.js'); 

const router = express.Router();

// POST /api/reports 
// Crea una nuova segnalazione
router.post(
    '/', 
    isAuth, 
    reportController.createReport
);

// GET /api/reports/me 
//  Vedi le tue segnalazioni inviate
router.get(
    '/me', 
    isAuth, 
    reportController.getMyReports
);

// GET /api/reports/me/admin
// Vedi tutte le segnalazioni (Dashboard Admin)
router.get(
    '/me/admin', 
    isAuth, 
    isAdmin, 
    reportController.getAllReports
);

// PATCH /api/reports/:id/status
// Cambia stato 
router.patch(
    '/:id/status', 
    isAuth, 
    isAdmin, 
    reportController.updateReportStatus
);

module.exports = router;