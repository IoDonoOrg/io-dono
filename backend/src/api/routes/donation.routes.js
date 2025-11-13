const express = require('express');
const router = express.Router();
const donationController = require('../controllers/donation.controller.js');
const { isAuth, isDonor, isAssociation } = require('../../middleware/auth.middleware.js');

// ROTTE PER I DONATORI 
// Queste rotte richiedono che l'utente sia loggato (isAuth) E sia un donatore (isDonor)

// POST /api/donations
// Crea una nuova donazione
router.post(
    '/',
    isAuth,
    isDonor,
    donationController.createDonation
);

// GET /api/donations/me/available
// Ottiene lo storico delle donazioni del donatore loggato
router.get(
    '/me/available',
    isAuth,
    isDonor,
    donationController.getMyDonationsAvailable
);

// GET /api/donations/me/accepted
// Ottiene lo storico delle donazioni del donatore loggato
router.get(
    '/me/accepted',
    isAuth,
    isDonor,
    donationController.getMyDonationsAccepted
);

// GET /api/donations/me/completed
// Ottiene lo storico delle donazioni del donatore loggato
router.get(
    '/me/completed',
    isAuth,
    isDonor,
    donationController.getMyDonationsCompleted
);

// PUT /api/donations/:id 
// Modifica una donazione 
router.put(
    '/:id',
    isAuth,
    isDonor,
    donationController.updateMyDonation
);

// DELETE /api/donations/:id 
// Cancella una donazione (solo se 'AVAILABLE')
router.delete(
    '/:id',
    isAuth,
    isDonor,
    donationController.cancelMyDonation
);


// ROTTE PER LE ASSOCIAZIONI
// Queste rotte richiedono che l'utente sia loggato (isAuth) E sia un'associazione (isAssociation)

// GET /api/donations/available 
// Cerca donazioni disponibili
router.get(
    '/available',
    isAuth,
    isAssociation,
    donationController.getAvailableDonations
);

// GET /api/donations/accepted 
// Cerca donazioni accettate
router.get(
    '/accepted',
    isAuth,
    isAssociation,
    donationController.getAcceptedeDonations
);

// GET /api/donations/completed 
// Cerca donazioni completate
router.get(
    '/completed',
    isAuth,
    isAssociation,
    donationController.getCompletedDonations
);

// POST /api/donations/:id/accept 
// Accetta una donazione
router.post(
    '/:id/accept',
    isAuth,
    isAssociation,
    donationController.acceptDonation
);

// POST /api/donations/:id/complete 
// Completa una donazione
router.post(
    '/:id/complete',
    isAuth,
    isAssociation,
    donationController.completeDonation
);

module.exports = router;