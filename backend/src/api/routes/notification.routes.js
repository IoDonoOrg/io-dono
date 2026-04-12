const express = require('express');
const notificationController = require('../controllers/notification.controller');
const { isAuth } = require('../../middleware/auth.middleware');

const router = express.Router();

router.get('/', isAuth, notificationController.listMyNotifications);
router.patch('/', isAuth, notificationController.patchMyNotifications);
router.patch('/:id', isAuth, notificationController.patchMyNotification);

module.exports = router;
