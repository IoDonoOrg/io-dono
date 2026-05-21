const express = require('express');
const associationReportController = require('../controllers/associationReport.controller');
const { isAuth, isAssociation } = require('../../middleware/auth.middleware');


const router = express.Router();

// Nuovi endpoint più RESTful sotto il namespace /reports
router.get('/reports/weekly', isAuth, isAssociation, associationReportController.getWeeklyReport);
router.get('/reports/items', isAuth, isAssociation, associationReportController.getItemsReport);

module.exports = router;
