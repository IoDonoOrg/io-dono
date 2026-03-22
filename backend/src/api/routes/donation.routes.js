const express = require('express');
const router = express.Router();
const donationController = require('../controllers/donation.controller.js');
const { isAuth } = require('../../middleware/auth.middleware.js');

// Definisce le rotte REST della risorsa donations.
// Crea una donazione (solo ruolo DONOR).
router.post('/', isAuth, donationController.createDonation);

// Elenca o filtra le donazioni.
router.get('/', isAuth, donationController.listDonations);

// Recupera una donazione per identificativo.
router.get('/:id', isAuth, donationController.getDonationById);

// Aggiorna parzialmente una donazione in base a ruolo e stato.
router.patch('/:id', isAuth, donationController.patchDonation);

// Elimina una donazione del proprietario donatore.
router.delete('/:id', isAuth, donationController.deleteDonation);

module.exports = router;