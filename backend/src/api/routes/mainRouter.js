const express = require('express');
const router = express.Router();

// Importa i router di dominio.
const authRoutes = require('./auth.routes.js');
const donationsRoutes = require('./donation.routes.js');
const reportRoutes = require('./report.routes.js');
const notificationRoutes = require('./notification.routes.js');
const rewardRoutes = require('./reward.routes.js');
const rewardClaimRoutes = require('./rewardClaim.routes.js');
const adminRoutes = require('./admin.routes.js');
const associationRoutes = require('./association.routes.js');

// Monta i router sotto i prefissi API.
router.use('/auth', authRoutes);
router.use('/donations', donationsRoutes);
router.use('/reports', reportRoutes);
router.use('/me/notifications', notificationRoutes);
router.use('/rewards', rewardRoutes);
router.use('/me/rewards/claims', rewardClaimRoutes);
router.use('/admin', adminRoutes);
router.use('/associations', associationRoutes);


// Espone una risposta base per il root API.
router.get('/', (req, res) => {
    res.json({ message: 'api default' });
});

module.exports = router;