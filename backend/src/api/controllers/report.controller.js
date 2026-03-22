const Report = require('../models/Segnalazione');
const mongoose = require('mongoose');

const isAdmin = (user) => user && user.role === 'ADMIN';

// Crea una nuova segnalazione.
exports.createReport = async (req, res) => {
    try {
        // Estrae i campi dal body con validazione semantica del tipo.
        const { reportedUserId, donationId, type, description } = req.body;

        // Richiede almeno un target tra utente segnalato o donazione segnalata.
        if (!reportedUserId && !donationId) {
            return res.status(400).json({
                message: 'Devi specificare un reportedUserId oppure un donationId.'
            });
        }

        // Persistenza della segnalazione in stato OPEN.
        const newReport = await Report.create({
            reporterId: req.user._id,
            reportedUserId: reportedUserId || null,
            donationId: donationId || null,
            type,
            description,
            status: 'OPEN'
        });

        return res.status(201).json({
            status: 'success',
            data: { report: newReport }
        });

    } catch (error) {
        return res.status(500).json({ message: 'Errore nella creazione della segnalazione', error: error.message });
    }
};

// Elenca le segnalazioni visibili all'utente corrente.
exports.listReports = async (req, res) => {
    try {
        const { status, type, scope = 'me' } = req.query;
        const filter = {};

        if (status) {
            filter.status = status.toUpperCase();
        }
        if (type) {
            filter.type = type;
        }

        // Mantiene la visibilità: utente standard solo proprie, admin con scope=all tutte.
        const requestingAll = scope === 'all';
        if (!isAdmin(req.user) || !requestingAll) {
            filter.reporterId = req.user._id;
        }

        const reports = await Report.find(filter)
            .populate('reporterId', 'name email')
            .populate('reportedUserId', 'name email')
            .populate('donationId')
            .sort({ createdAt: -1 });

        return res.status(200).json({
            status: 'success',
            results: reports.length,
            data: { reports }
        });

    } catch (error) {
        return res.status(500).json({ message: 'Errore nel recupero delle segnalazioni', error: error.message });
    }
};

// Recupera una segnalazione per ID.
exports.getReportById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'ID segnalazione non valido.' });
        }

        const report = await Report.findById(id)
            .populate('reporterId', 'name email')
            .populate('reportedUserId', 'name email')
            .populate('donationId');

        if (!report) {
            return res.status(404).json({ message: 'Segnalazione non trovata.' });
        }

        const reporterIdValue = report.reporterId && report.reporterId._id
            ? report.reporterId._id.toString()
            : report.reporterId.toString();

        if (!isAdmin(req.user) && reporterIdValue !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Accesso negato.' });
        }

        return res.status(200).json({
            status: 'success',
            data: { report }
        });
    } catch (error) {
        return res.status(500).json({ message: 'Errore nel recupero della segnalazione', error: error.message });
    }
};

// Aggiorna parzialmente una segnalazione (solo ADMIN).
exports.patchReport = async (req, res) => {
    try {
        if (!isAdmin(req.user)) {
            return res.status(403).json({ message: 'Accesso negato. Richiesto ruolo Admin.' });
        }

        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'ID segnalazione non valido.' });
        }

        const patch = {};
        if (req.body.status) patch.status = req.body.status;

        if (Object.keys(patch).length === 0) {
            return res.status(400).json({ message: 'Nessun campo valido da aggiornare.' });
        }

        const report = await Report.findByIdAndUpdate(id, patch, { new: true, runValidators: true });

        if (!report) {
            return res.status(404).json({ message: 'Segnalazione non trovata' });
        }

        return res.status(200).json({
            status: 'success',
            data: { report }
        });
    } catch (error) {
        return res.status(500).json({ message: 'Errore aggiornamento stato', error: error.message });
    }
};