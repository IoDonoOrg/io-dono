const Donation = require('../models/Donazione');
const User = require('../models/User');

// --- FUNZIONI PER I DONATORI ---

/**
 * Logica per: POST /api/donations
 * Azione: Creare una nuova donazione
 * Protetto da: isAuth, isDonor
 */
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



exports.getMyDonations = async (req, res) => {
    try {
        const donations = await Donation.find({ donorId: req.user._id });
        res.status(200).json(donations);
    } catch (error) {
        res.status(500).json({ message: 'Errore del server', error: error.message });
    }
};

exports.updateMyDonation = async (req, res) => {
    res.status(501).json({ message: 'TODO: Aggiorna la mia donazione' });
};

exports.cancelMyDonation = async (req, res) => {
    res.status(501).json({ message: 'TODO: Cancella la mia donazione' });
};

exports.getAvailableDonations = async (req, res) => {
    res.status(501).json({ message: 'TODO: Mostra donazioni disponibili' });
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