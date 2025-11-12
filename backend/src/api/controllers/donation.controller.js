const Donation = require('../models/Donazione');
const User = require('../models/User');
const mongoose = require('mongoose');

// funzioni per i donatori

// POST /api/donations
// crea una nuova donazione
exports.createDonation = async (req, res) => {
    try {
        // 1. Prendi i dati della donazione dal body
        const { type, quantity, pickupTime, notes, pickupLocation } = req.body;

        // 2. Prendi l'ID del donatore dal token (allegato da isAuth)
        const donorId = req.user._id;

        // 3. Controllo di validità per la data
        const pickupDate = new Date(pickupTime);
        if (isNaN(pickupDate.getTime())) {
            return res.status(400).json({ message: 'Formato data non valido. Usare ISO 8601 (es. YYYY-MM-DDTHH:MM:SS.sssZ)' });
        }
        if (pickupDate < new Date()) {
            return res.status(400).json({ message: 'La data di ritiro non può essere nel passato.' });
        }

        // 4. Controllo di validità
        if (!type || !quantity || !pickupLocation || !pickupLocation.address || !pickupLocation.geo) {
            return res.status(400).json({ message: 'Dati incompleti per la creazione della donazione.' });
        }

        // 5. Crea la nuova donazione
        const newDonation = new Donation({
            donorId,
            type,
            quantity,
            pickupTime: pickupDate, 
            notes,
            pickupLocation,
            status: 'AVAILABLE'
        });

        // 6. Salva nel database
        await newDonation.save();

        // 7. Invia la risposta 201 (e TERMINA la richiesta)
        return res.status(201).json(newDonation);

    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        return res.status(500).json({ message: 'Errore del server', error: error.message });
    }
};

// /api/donations/me
// ottieni tutte le tue donazioni
exports.getMyDonations = async (req, res) => {
    try {
        const donations = await Donation.find({ donorId: req.user._id }).sort({ createdAt: -1 }); // Ordina dalla più recente;
        res.status(200).json(donations);
    } catch (error) {
        res.status(500).json({ message: 'Errore del server', error: error.message });
    }
};

// PUT /api/donations/:id
// aggiorna una donazione
exports.updateMyDonation = async (req, res) => {
    try {
        const { id } = req.params; // L'ID della donazione dall'URL
        const { type, quantity, pickupTime, notes, pickupLocation } = req.body; // I nuovi dati

        // 1. Controlla che l'ID sia un ID MongoDB valido
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'ID donazione non valido.' });
        }

        // 2. Trova la donazione
        const donation = await Donation.findById(id);

        // 3. Controlli di sicurezza e di logica (mancano i controlli sulla data e sui parametri)
        if (!donation) {
            return res.status(404).json({ message: 'Donazione non trovata.' });
        }

        // controllo di sicurezza per verificare la proprietà della donazione
        if (donation.donorId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Accesso negato: non sei il proprietario di questa donazione.' });
        }

        // Puoi modificare solo se non è ancora stata accettata
        if (donation.status !== 'AVAILABLE') {
            return res.status(400).json({ message: 'Impossibile modificare: questa donazione è già stata accettata o completata.' });
        }
        
        // 4. Se tutti i controlli passano, aggiorna la donazione
        // Sovrascriviamo i campi che l'utente può modificare
        donation.type = type || donation.type;
        donation.quantity = quantity || donation.quantity;
        donation.pickupTime = pickupTime || donation.pickupTime;
        donation.notes = notes || donation.notes;

        // Aggiorniamo l'oggetto nestato 'pickupLocation' in modo sicuro
        if (pickupLocation) {
            if (pickupLocation.address) {
                donation.pickupLocation.address = pickupLocation.address;
            }
            // Se il frontend invia nuove coordinate
            // ci assicuriamo di aggiornare sia le coordinate CHE il tipo
            if (pickupLocation.geo && pickupLocation.geo.coordinates) {
                donation.pickupLocation.geo.coordinates = pickupLocation.geo.coordinates;
                donation.pickupLocation.geo.type = 'Point'; // mettiamo sempre Point senno mongodb non capisce
            }
        }

        const updatedDonation = await donation.save();

        // 5. Invia la donazione aggiornata
        res.status(200).json(updatedDonation);

    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: 'Errore del server', error: error.message });
    }
};

// DELETE /api/donations/:id 
// Cancella una donazione 
exports.cancelMyDonation = async (req, res) => {
    try {
        const { id } = req.params; // L'ID della donazione dall'URL

        // 1. Controlla che l'ID sia un ID MongoDB valido
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'ID donazione non valido.' });
        }

        // 2. Trova la donazione
        const donation = await Donation.findById(id);

        // 3. Controlli di sicurezza e di logica (mancano i controlli sulla data e sui parametri)
        if (!donation) {
            return res.status(404).json({ message: 'Donazione non trovata.' });
        }

        // controllo di sicurezza per verificare la proprietà della donazione
        if (donation.donorId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Accesso negato: non sei il proprietario di questa donazione.' });
        }

        /* Puoi eliminarla solo se non è ancora stata accettata
        if (donation.status !== 'AVAILABLE') {
            return res.status(400).json({ message: 'Impossibile eliminare: questa donazione è già stata accettata o completata.' });
        }
        */

        await donation.deleteOne();

        // 5. Invia la donazione aggiornata
        res.status(200).json("Eliminata con successo");

    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: 'Errore del server', error: error.message });
    }
};

// funzioni per le associazioni

// GET /api/donations/available 
// ritorna le donazioni (solo se 'AVAILABLE')
exports.getAvailableDonations = async (req, res) => {
    try {
        const donations = await Donation.find({ associationId: req.user._id },{ status: 'AVAILABLE'}).sort({ createdAt: -1 }); // Ordina dalla più recente;
        res.status(200).json(donations);
    } catch (error) {
        res.status(500).json({ message: 'Errore del server', error: error.message });
    }
};

exports.acceptDonation = async (req, res) => {
    res.status(501).json({ message: 'TODO: Accetta donazione' });
};

exports.completeDonation = async (req, res) => {
    res.status(501).json({ message: 'TODO: Completa donazione' });
};

exports.evaluateDonation = async (req, res) => {
    res.status(501).json({ message: 'TODO: Valuta donazione' });
};