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

// GET /api/reports/me/open
//  Vedi le tue segnalazioni inviate
router.get(
  '/me/open',
  isAuth,
  reportController.getMyOpenReports
);

// GET /api/reports/me/closed
//  Vedi le tue segnalazioni inviate
router.get(
  '/me/closed',
  isAuth,
  reportController.getMyClosedReports
);


// GET /api/reports/admin/open
// Vedi tutte le segnalazioni (Dashboard Admin)
router.get(
    '/admin/open', 
    isAuth, 
    isAdmin, 
    reportController.getAllOpenReports
);

// GET /api/reports/admin/closed
// Vedi tutte le segnalazioni (Dashboard Admin)
router.get(
  '/admin/closed',
  isAuth,
  isAdmin,
  reportController.getAllClosedReports
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