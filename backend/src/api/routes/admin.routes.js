const express = require('express');
const adminController = require('../controllers/admin.controller');
const { isAuth, isAdmin } = require('../../middleware/auth.middleware');

const router = express.Router();

router.post('/users', isAuth, isAdmin, adminController.createAssociationUser);
router.patch('/users/:id', isAuth, isAdmin, adminController.patchUserAdminState);

router.get('/statistics/overview', isAuth, isAdmin, adminController.getStatisticsOverview);
router.get('/statistics/trend', isAuth, isAdmin, adminController.getStatisticsTrend);
router.get('/statistics', isAuth, isAdmin, adminController.getStatistics);

module.exports = router;
