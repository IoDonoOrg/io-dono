const Donation = require('../models/Donazione');
const User = require('../models/User');
const mongoose = require('mongoose');

// funzioni per i donatori

// POST /api/donations
// crea una nuova donazione
exports.createDonation = async (req, res) => {
    try {
        // Prendi i dati della donazione dal body
        const { items, pickupTime, notes, pickupLocation } = req.body;

        // Prendi l'ID del donatore dal token (allegato da isAuth)
        const donorId = req.user._id;

        // Controllo di validità per la data
        const pickupDate = new Date(pickupTime);
        if (isNaN(pickupDate.getTime())) {
            return res.status(400).json({ message: 'Formato data non valido.' });
        }
        if (pickupDate < new Date()) {
            return res.status(400).json({ message: 'La data di ritiro non può essere nel passato.' });
        }

        // Controllo di validità per items e location
        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ message: 'La lista degli oggetti (items) non può essere vuota.' });
        }

        if (!pickupLocation || !pickupLocation.address || !pickupLocation.geo) {
            return res.status(400).json({ message: 'Dati incompleti per la posizione (pickupLocation).' });
        }

        // Crea la nuova donazione
        const newDonation = new Donation({
            donorId,
            items, 
            pickupTime: pickupDate, 
            notes,
            pickupLocation,
            status: 'AVAILABLE'
        });

        // Salva nel database
        await newDonation.save();
        // Invia la risposta 201 
        return res.status(201).json(newDonation);

    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        return res.status(500).json({ message: 'Errore del server', error: error.message });
    }
};

// /api/donations/me/available
// ottieni tutte le tue donazioni available
exports.getMyDonationsAvailable = async (req, res) => {
    try {
        const donations = await Donation.find({ donorId: req.user._id, status: 'AVAILABLE' }).sort({ createdAt: -1 }); // Ordina dalla più recente;
        return res.status(200).json(donations);
    } catch (error) {
        return res.status(500).json({ message: 'Errore del server', error: error.message });
    }
};

// /api/donations/me/accepted
// ottieni tutte le tue donazioni accepted
exports.getMyDonationsAccepted = async (req, res) => {
    try {
        const donations = await Donation.find({ donorId: req.user._id, status: 'ACCEPTED' }).sort({ createdAt: -1 }); // Ordina dalla più recente;
        return res.status(200).json(donations);
    } catch (error) {
        return res.status(500).json({ message: 'Errore del server', error: error.message });
    }
};

// /api/donations/me/completed
// ottieni tutte le tue donazioni completed
exports.getMyDonationsCompleted = async (req, res) => {
    try {
        const donations = await Donation.find({ donorId: req.user._id, status: 'COMPLETED' }).sort({ createdAt: -1 }); // Ordina dalla più recente;
        return res.status(200).json(donations);
    } catch (error) {
        return res.status(500).json({ message: 'Errore del server', error: error.message });
    }
};

// PUT /api/donations/:id
// aggiorna una donazione
exports.updateMyDonation = async (req, res) => {
    try {
        const { id } = req.params;
        // Estraiamo 'items' invece di type/quantity
        const { items, pickupTime, notes, pickupLocation } = req.body;

        // Controlla che l'ID sia un ID MongoDB valido
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'ID donazione non valido.' });
        }

        // Trova la donazione
        const donation = await Donation.findById(id);

        // Controlli di sicurezza e di logica 
        if (!donation) {
            return res.status(404).json({ message: 'Donazione non trovata.' });
        }

        // Controllo di validità per la data
        if(pickupTime){
            const pickupDate = new Date(pickupTime);
            if (isNaN(pickupDate.getTime())) {
                return res.status(400).json({ message: 'Formato data non valido.' });
            }
            if (pickupDate < new Date()) {
                return res.status(400).json({ message: 'La data di ritiro non può essere nel passato.' });
            }

            donation.pickupTime = pickupDate;
        }

        // controllo di sicurezza per verificare la proprietà della donazione
        if (donation.donorId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Accesso negato: non sei il proprietario.' });
        }

        // Puoi modificare solo se non è ancora stata accettata
        if (donation.status !== 'AVAILABLE') {
            return res.status(400).json({ message: 'Impossibile modificare: donazione già accettata o completata.' });
        }
        
        // Se tutti i controlli passano, aggiorna la donazione
        // Sovrascriviamo i campi che l'utente può modificare
        if (items) {
            if (!Array.isArray(items) || items.length === 0) {
                return res.status(400).json({ message: 'La lista degli oggetti non può essere vuota.' });
            }
            donation.items = items;
        }
    
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

        // Invia la donazione aggiornata
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
        return res.status(200).json("Eliminata con successo");

    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        return res.status(500).json({ message: 'Errore del server', error: error.message });
    }
};

// funzioni per le associazioni

// GET /api/donations/available 
// ritorna le donazioni (solo se 'AVAILABLE')
exports.getAvailableDonations = async (req, res) => {
    try {
        const donations = await Donation.find({ status: 'AVAILABLE'}).sort({ createdAt: -1 }); // Ordina dalla più recente;
        return res.status(200).json(donations);
    } catch (error) {
        return res.status(500).json({ message: 'Errore del server', error: error.message });
    }
};

// GET /api/donations/accepted 
// ritorna le donazioni (solo se 'ACCEPTED')
exports.getAcceptedeDonations = async (req, res) => {
    try {
        const associationId = req.user._id;

        const donations = await Donation.find({ 
            status: 'ACCEPTED', 
            associationId: associationId
        }).sort({ createdAt: -1 }); 
        
        return res.status(200).json(donations);
    } catch (error) {
        return res.status(500).json({ message: 'Errore del server', error: error.message });
    }
};

// GET /api/donations/completed 
// ritorna le donazioni (solo se 'COMPLETED')
exports.getCompletedDonations = async (req, res) => {
    try {
        const associationId = req.user._id;

        const donations = await Donation.find({ 
            status: 'COMPLETED', 
            associationId: associationId
        }).sort({ createdAt: -1 });

        return res.status(200).json(donations);
    } catch (error) {
        return res.status(500).json({ message: 'Errore del server', error: error.message });
    }
};

// POST /api/donations/:id/accept 
// accetta una donazione
exports.acceptDonation = async (req, res) => {
    try {
        const { id } = req.params; // L'ID della donazione dall'URL
        const associationId = req.user._id; // id della associazione

         // 1. Controlla che l'ID sia un ID MongoDB valido
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'ID donazione non valido.' });
        }

        // trova E Aggiorna la donazione in un colpo solo tipo trasazione.
        const updatedDonation = await Donation.findOneAndUpdate(
            { _id: id, status: 'AVAILABLE' }, // condizioni di ricerca
            {
                $set: {
                    status: 'ACCEPTED', // aggiorna lo stato
                    associationId: associationId // assegna l'associazione
                }
            },
            { new: true } // restituisce l'oggetto aggornato
        );

        // controlla se l'aggiornamento è fallito
        if (!updatedDonation) {
            const donation = await Donation.findById(id);
            if (!donation) {
                return res.status(404).json({ message: 'Donazione non trovata.' });
            }
            // Se esiste ma lo status non è AVAILABLE
            return res.status(400).json({ message: 'Questa donazione non è più disponibile o è già stata accettata.' });
        }

        // invia la donazione aggiornata
        return res.status(200).json(updatedDonation);

    } catch (error) {
        res.status(500).json({ message: 'Errore del server', error: error.message });
    }
};

// POST /api/donations/:id/complete 
// Completa una donazione
exports.completeDonation = async (req, res) => {
    let session = null; // per la transazione del db

    try {
        session = await mongoose.startSession();
        session.startTransaction();

        const { id } = req.params;
        const { evaluation } = req.body; 
        const associationId = req.user._id;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ message: 'ID donazione non valido.' });
        }
     
        if (!evaluation || !evaluation.rating) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ message: 'Valutazione (rating) richiesta per completare.' });
        }

        // Aggiorna la Donazione
        const updatedDonation = await Donation.findOneAndUpdate(
            {
                _id: id,
                status: 'ACCEPTED',
                associationId: associationId
            },
            { 
                $set: { 
                    status: 'COMPLETED',
                    evaluation: evaluation 
                } 
            },
            { new: true, session: session } // Passa la sessione
        );

        // Controlla se l'aggiornamento è fallito
        if (!updatedDonation) {
            await session.abortTransaction();
            session.endSession();
            const donation = await Donation.findById(id).session(session); 
            if (!donation) {
                return res.status(404).json({ message: 'Donazione non trovata.' });
            }
            if (donation.associationId.toString() !== associationId.toString()) {
                 return res.status(403).json({ message: 'Accesso negato: non sei l\'associazione che ha accettato questa donazione.' });
            }
            if (donation.status !== 'ACCEPTED') {
                 return res.status(400).json({ message: 'Errore: questa donazione non è nello stato corretto (deve essere ACCEPTED).' });
            }
            return res.status(400).json({ message: 'Impossibile completare la donazione.' });
        }
        
        // Assegna punti al Donatore 
        await User.findByIdAndUpdate(
            updatedDonation.donorId,
            { $inc: { solidarityPoints: 10 } }, // 10 sono un esempio
            { session: session } 
        );

        // fai il commit
        await session.commitTransaction();

        // Invia la risposta
        return res.status(200).json(updatedDonation);

    } catch (error) {
        // fai il 'rollback'
        if (session) {
            await session.abortTransaction();
        }
        return res.status(500).json({ message: 'Errore del server durante la transazione.', error: error.message });
    } finally {
        // chiude la sessione
        if (session) {
            session.endSession();
        }
    }
};