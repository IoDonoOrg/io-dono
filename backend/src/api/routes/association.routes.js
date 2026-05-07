const express = require('express');
const associationReportController = require('../controllers/associationReport.controller');
const { isAuth, isAssociation } = require('../../middleware/auth.middleware');

const router = express.Router();

router.get('/weekly', isAuth, isAssociation, associationReportController.getWeeklyReport);
router.get('/items', isAuth, isAssociation, associationReportController.getItemsReport);

module.exports = router;
