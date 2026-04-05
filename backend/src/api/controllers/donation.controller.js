const Donation = require('../models/Donazione');
const User = require('../models/User');
const Notification = require('../models/Notification');
const mongoose = require('mongoose');

const isDonor = (user) => user && user.role === 'DONOR';
const isAssociation = (user) => user && user.role === 'ASSOCIATION';
const isAdmin = (user) => user && user.role === 'ADMIN';

// Crea una donazione.
exports.createDonation = async (req, res) => {
    try {
        if (!isDonor(req.user)) {
            return res.status(403).json({ message: 'Accesso negato. Richiesto ruolo Donatore.' });
        }

        const { items, pickupTime, notes, pickupLocation } = req.body;
        const donorId = req.user._id;

        const pickupDate = new Date(pickupTime);
        if (isNaN(pickupDate.getTime())) return res.status(400).json({ message: 'Formato data non valido.' });
        if (pickupDate < new Date()) return res.status(400).json({ message: 'La data di ritiro non può essere nel passato.' });

        if (!items || !Array.isArray(items) || items.length === 0) return res.status(400).json({ message: 'La lista degli oggetti (items) non può essere vuota.' });
        if (!pickupLocation || !pickupLocation.address || !pickupLocation.geo) return res.status(400).json({ message: 'Dati incompleti per la posizione (pickupLocation).' });

        const newDonation = new Donation({ donorId, items, pickupTime: pickupDate, notes, pickupLocation, status: 'AVAILABLE' });
        await newDonation.save();

        res.location(`/api/donations/${newDonation._id}`);
        return res.status(201).json(newDonation);
    } catch (error) {
        if (error.name === 'ValidationError') return res.status(400).json({ message: error.message });
        return res.status(500).json({ message: 'Errore del server', error: error.message });
    }
};

// Elenca e filtra le donazioni.
exports.listDonations = async (req, res) => {
    try {
        const { status, page = 1, limit = 20, owner, donorId, associationId } = req.query;
        const filter = {};

        if (status) filter.status = status.toUpperCase();

        // Applica i vincoli di visibilità in base al ruolo.
        if (isDonor(req.user)) {
            // Il donatore visualizza esclusivamente le proprie donazioni.
            filter.donorId = req.user._id;
            if (owner && owner !== 'me') {
                return res.status(400).json({ message: 'Per i donatori è supportato solo owner=me.' });
            }
        } else if (isAssociation(req.user)) {
            // L'associazione visualizza AVAILABLE globali e le proprie ACCEPTED/COMPLETED.
            if (!filter.status) {
                filter.status = 'AVAILABLE';
            }

            if (['ACCEPTED', 'COMPLETED'].includes(filter.status)) {
                filter.associationId = req.user._id;
            } else if (filter.status !== 'AVAILABLE') {
                return res.status(400).json({ message: 'Status non supportato per il ruolo Associazione.' });
            }
        } else if (isAdmin(req.user)) {
            if (owner === 'me') {
                return res.status(400).json({ message: 'owner=me non supportato per Admin.' });
            }
            if (donorId) filter.donorId = donorId;
            if (associationId) filter.associationId = associationId;
        } else {
            return res.status(403).json({ message: 'Ruolo utente non autorizzato.' });
        }

        const skip = (Math.max(1, parseInt(page)) - 1) * Math.max(1, parseInt(limit));
        const [items, total] = await Promise.all([
            Donation.find(filter).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)),
            Donation.countDocuments(filter)
        ]);

        const meta = { page: parseInt(page), limit: parseInt(limit), total };
        const links = { self: req.originalUrl };

        return res.status(200).json({ items, meta, links });
    } catch (error) {
        return res.status(500).json({ message: 'Errore del server', error: error.message });
    }
};

// Recupera una donazione tramite ID.
exports.getDonationById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'ID donazione non valido.' });

        const donation = await Donation.findById(id);
        if (!donation) return res.status(404).json({ message: 'Donazione non trovata.' });

        const isOwner = donation.donorId && donation.donorId.toString() === req.user._id.toString();
        const isAssociated = donation.associationId && donation.associationId.toString() === req.user._id.toString();

        if (isAdmin(req.user)) {
            return res.status(200).json(donation);
        }

        if (isDonor(req.user)) {
            if (!isOwner) return res.status(403).json({ message: 'Accesso negato.' });
            return res.status(200).json(donation);
        }

        if (isAssociation(req.user)) {
            if (donation.status === 'AVAILABLE' || isAssociated) {
                return res.status(200).json(donation);
            }
            return res.status(403).json({ message: 'Accesso negato.' });
        }

        return res.status(403).json({ message: 'Ruolo utente non autorizzato.' });
    } catch (error) {
        return res.status(500).json({ message: 'Errore del server', error: error.message });
    }
};

// Aggiorna parzialmente una donazione.
// Gestisce modifiche del donatore e transizioni di stato dell'associazione.
exports.patchDonation = async (req, res) => {
    let session = null;
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'ID donazione non valido.' });

        const donation = await Donation.findById(id);
        if (!donation) return res.status(404).json({ message: 'Donazione non trovata.' });

        // Gestisce le transizioni di stato richieste nel payload.
        if (req.body && req.body.status) {
            const targetStatus = req.body.status.toUpperCase();

            // Consente ACCEPTED solo ad associazione e solo da AVAILABLE.
            if (targetStatus === 'ACCEPTED') {
                if (!isAssociation(req.user)) return res.status(403).json({ message: 'Solo le associazioni possono accettare donazioni.' });
                if (donation.status !== 'AVAILABLE') return res.status(409).json({ message: 'Questa donazione non è più disponibile.' });

                session = await mongoose.startSession();
                session.startTransaction();

                const updated = await Donation.findOneAndUpdate(
                    { _id: id, status: 'AVAILABLE' },
                    { $set: { status: 'ACCEPTED', associationId: req.user._id } },
                    { new: true, session }
                );
                if (!updated) return res.status(400).json({ message: 'Impossibile accettare la donazione.' });

                await Notification.create([{
                    recipientId: updated.donorId,
                    type: 'DONATION_ACCEPTED',
                    title: 'Donazione accettata',
                    message: 'Una tua donazione e stata accettata da un\'associazione.',
                    metadata: { donationId: updated._id }
                }], { session });

                await session.commitTransaction();
                session.endSession();
                session = null;

                return res.status(200).json(updated);
            }

            // Consente COMPLETED solo ad associazione con evaluation valorizzata.
            if (targetStatus === 'COMPLETED') {
                if (!isAssociation(req.user)) return res.status(403).json({ message: 'Solo le associazioni possono completare donazioni.' });
                const { evaluation } = req.body;
                if (!evaluation || !evaluation.rating) return res.status(400).json({ message: 'Valutazione (rating) richiesta per completare.' });

                session = await mongoose.startSession();
                session.startTransaction();

                const updatedDonation = await Donation.findOneAndUpdate({ _id: id, status: 'ACCEPTED', associationId: req.user._id }, { $set: { status: 'COMPLETED', evaluation } }, { new: true, session });
                if (!updatedDonation) {
                    await session.abortTransaction();
                    session.endSession();
                    const d = await Donation.findById(id);
                    if (!d) return res.status(404).json({ message: 'Donazione non trovata.' });
                    if (d.associationId && d.associationId.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Accesso negato: non sei l\'associazione che ha accettato questa donazione.' });
                    if (d.status !== 'ACCEPTED') return res.status(400).json({ message: 'Questa donazione non è nello stato corretto.' });
                    return res.status(400).json({ message: 'Impossibile completare la donazione.' });
                }

                await User.findByIdAndUpdate(updatedDonation.donorId, { $inc: { solidarityPoints: 10 } }, { session });
                await Notification.create([{
                    recipientId: updatedDonation.donorId,
                    type: 'DONATION_COMPLETED',
                    title: 'Ritiro completato',
                    message: 'Il ritiro della tua donazione e stato completato.',
                    metadata: { donationId: updatedDonation._id }
                }], { session });
                await session.commitTransaction();
                session.endSession();
                return res.status(200).json(updatedDonation);
            }

            return res.status(400).json({ message: 'Transizione di stato non supportata.' });
        }

        // In assenza di cambio stato applica aggiornamento campi del proprietario donatore.
        if (!isDonor(req.user)) return res.status(403).json({ message: 'Solo i donatori possono modificare la donazione.' });
        if (donation.donorId.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Accesso negato: non sei il proprietario.' });
        if (donation.status !== 'AVAILABLE') return res.status(409).json({ message: 'Impossibile modificare: donazione già accettata o completata.' });

        const { items, pickupTime, notes, pickupLocation } = req.body;
        if (pickupTime) {
            const pickupDate = new Date(pickupTime);
            if (isNaN(pickupDate.getTime())) return res.status(400).json({ message: 'Formato data non valido.' });
            if (pickupDate < new Date()) return res.status(400).json({ message: 'La data di ritiro non può essere nel passato.' });
            donation.pickupTime = pickupDate;
        }

        if (items) {
            if (!Array.isArray(items) || items.length === 0) return res.status(400).json({ message: 'La lista degli oggetti non può essere vuota.' });
            donation.items = items;
        }

        donation.notes = notes || donation.notes;
        if (pickupLocation) {
            if (pickupLocation.address) donation.pickupLocation.address = pickupLocation.address;
            if (pickupLocation.geo && pickupLocation.geo.coordinates) {
                donation.pickupLocation.geo.coordinates = pickupLocation.geo.coordinates;
                donation.pickupLocation.geo.type = 'Point';
            }
        }

        const updatedDonation = await donation.save();
        return res.status(200).json(updatedDonation);
    } catch (error) {
        if (session) {
            try { await session.abortTransaction(); } catch (e) { }
            session.endSession();
        }
        if (error.name === 'ValidationError') return res.status(400).json({ message: error.message });
        return res.status(500).json({ message: 'Errore del server', error: error.message });
    }
};

// Elimina una donazione.
exports.deleteDonation = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'ID donazione non valido.' });

        if (!isDonor(req.user)) {
            return res.status(403).json({ message: 'Solo i donatori possono cancellare una donazione.' });
        }

        const donation = await Donation.findById(id);
        if (!donation) return res.status(404).json({ message: 'Donazione non trovata.' });
        if (donation.donorId.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Accesso negato: non sei il proprietario di questa donazione.' });
        if (donation.status !== 'AVAILABLE') return res.status(409).json({ message: 'Impossibile cancellare: la donazione non è più disponibile.' });

        // Blocca l'eliminazione quando la donazione è già completata.
        if (donation.status === 'COMPLETED') {
            return res.status(400).json({ message: 'Impossibile eliminare: questa donazione è già stata completata.' });
        }

        await donation.deleteOne();
        return res.status(204).send();
    } catch (error) {
        if (error.name === 'ValidationError') return res.status(400).json({ message: error.message });
        return res.status(500).json({ message: 'Errore del server', error: error.message });
    }
};