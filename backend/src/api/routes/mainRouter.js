const express = require('express');
const router = express.Router();

// bisogna importare tutti i file delle singole rotte per poi dirottare il traffico su quelle giuste
const authRoutes = require('./auth.routes.js');

// per esempio le rotte in auth.routes.js avranno il prefisso /api/auth chiaramente
router.use('/auth', authRoutes);

// e così via per tutti gli altri

// Rotta di default, possiamo anche toglierla
router.get('/', (req, res) => {
    res.json({ message: 'api default' });
});

module.exports = router;