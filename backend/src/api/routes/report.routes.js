const express = require('express');
const reportController = require('../controllers/report.controller');
const { isAuth } = require('../../middleware/auth.middleware.js');

const router = express.Router();

// Crea una nuova segnalazione.
router.post('/', isAuth, reportController.createReport);

// Elenca le segnalazioni con filtri opzionali.
// Query supportate: status, scope, type.
router.get('/', isAuth, reportController.listReports);

// Recupera una segnalazione specifica.
router.get('/:id', isAuth, reportController.getReportById);

// Aggiorna parzialmente la segnalazione (solo ADMIN).
router.patch('/:id', isAuth, reportController.patchReport);

module.exports = router;