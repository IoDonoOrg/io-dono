const express = require('express');
const router = express.Router();
// const authController = require('../controllers/auth.controller'); // import per il controller di riferimento
// const { isAuth } = require('../../middleware/auth.middleware'); // import per eventuali middleware


// rotta di test, ipoteticamente per ogni rotta useremo non una lambda function
//  ma una funzione del controller o del middleware, per esempio: router.post('/login', authController.login);
router.get('/test', (req, res) => res.json({ message: 'auth routes funzionanti' }));

module.exports = router;