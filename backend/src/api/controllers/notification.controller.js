const Notification = require('../models/Notification');
const mongoose = require('mongoose');

// Elenca le notifiche dell'utente autenticato.
exports.listMyNotifications = async (req, res) => {
    try {
        const { page = 1, limit = 20, isRead, type } = req.query;
        const filter = { recipientId: req.user._id };

        if (typeof isRead !== 'undefined') {
            filter.isRead = String(isRead) === 'true';
        }

        if (type) {
            filter.type = type;
        }

        const safePage = Math.max(1, parseInt(page, 10) || 1);
        const safeLimit = Math.max(1, parseInt(limit, 10) || 20);
        const skip = (safePage - 1) * safeLimit;

        const [items, total] = await Promise.all([
            Notification.find(filter).sort({ createdAt: -1 }).skip(skip).limit(safeLimit),
            Notification.countDocuments(filter)
        ]);

        return res.status(200).json({
            items,
            meta: {
                page: safePage,
                limit: safeLimit,
                total
            }
        });
    } catch (error) {
        return res.status(500).json({ message: 'Errore nel recupero delle notifiche.', error: error.message });
    }
};

// Aggiorna parzialmente una notifica dell'utente autenticato.
exports.patchMyNotification = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'ID notifica non valido.' });
        }

        const patch = {};
        if (typeof req.body.isRead !== 'undefined') {
            patch.isRead = Boolean(req.body.isRead);
        }

        if (Object.keys(patch).length === 0) {
            return res.status(400).json({ message: 'Nessun campo valido da aggiornare.' });
        }

        const notification = await Notification.findOneAndUpdate(
            { _id: id, recipientId: req.user._id },
            { $set: patch },
            { new: true }
        );

        if (!notification) {
            return res.status(404).json({ message: 'Notifica non trovata.' });
        }

        return res.status(200).json(notification);
    } catch (error) {
        return res.status(500).json({ message: 'Errore aggiornamento notifica.', error: error.message });
    }
};

// Aggiorna in blocco le notifiche dell'utente autenticato.
exports.patchMyNotifications = async (req, res) => {
    try {
        if (typeof req.body.isRead === 'undefined') {
            return res.status(400).json({ message: 'Campo isRead richiesto.' });
        }

        const result = await Notification.updateMany(
            { recipientId: req.user._id },
            { $set: { isRead: Boolean(req.body.isRead) } }
        );

        return res.status(200).json({
            matchedCount: result.matchedCount,
            modifiedCount: result.modifiedCount
        });
    } catch (error) {
        return res.status(500).json({ message: 'Errore aggiornamento notifiche.', error: error.message });
    }
};
