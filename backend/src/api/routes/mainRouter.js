const express = require('express');
const router = express.Router();

// Importa i router di dominio.
const authRoutes = require('./auth.routes.js');
const donationsRoutes = require('./donation.routes.js');
const reportRoutes = require('./report.routes.js');

// Monta i router sotto i prefissi API.
router.use('/auth', authRoutes);
router.use('/donations', donationsRoutes);
router.use('/reports', reportRoutes);


// Espone una risposta base per il root API.
router.get('/', (req, res) => {
    res.json({ message: 'api default' });
});

module.exports = router;