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
        const {
            status,
            type,
            scope = 'me',
            fromDate,
            toDate,
            reporterId,
            reportedUserId,
            page = 1,
            limit = 20
        } = req.query;
        const filter = {};

        if (status) {
            filter.status = status.toUpperCase();
        }
        if (type) {
            filter.type = type;
        }

        if (fromDate || toDate) {
            const from = new Date(fromDate);
            const to = new Date(toDate);
            if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime())) {
                return res.status(400).json({ message: 'Formato data non valido.' });
            }
            if (from > to) {
                return res.status(400).json({ message: 'Intervallo date non valido.' });
            }
            filter.createdAt = { $gte: from, $lte: to };
        }

        if (reporterId) {
            if (!mongoose.Types.ObjectId.isValid(reporterId)) {
                return res.status(400).json({ message: 'reporterId non valido.' });
            }
            filter.reporterId = reporterId;
        }

        if (reportedUserId) {
            if (!mongoose.Types.ObjectId.isValid(reportedUserId)) {
                return res.status(400).json({ message: 'reportedUserId non valido.' });
            }
            filter.reportedUserId = reportedUserId;
        }

        // Mantiene la visibilità: utente standard solo proprie, admin con scope=all tutte.
        const requestingAll = scope === 'all';
        if (!isAdmin(req.user) || !requestingAll) {
            filter.reporterId = req.user._id;
        }

        const safePage = Math.max(1, parseInt(page, 10) || 1);
        const safeLimit = Math.max(1, parseInt(limit, 10) || 20);
        const skip = (safePage - 1) * safeLimit;

        const [reports, total] = await Promise.all([
            Report.find(filter)
                .populate('reporterId', 'name email')
                .populate('reportedUserId', 'name email')
                .populate('donationId')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(safeLimit),
            Report.countDocuments(filter)
        ]);

        return res.status(200).json({
            status: 'success',
            results: reports.length,
            data: { reports },
            meta: {
                page: safePage,
                limit: safeLimit,
                total
            }
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
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'ID segnalazione non valido.' });
        }

        const patch = {};
        if (req.body.status) {
            patch.status = String(req.body.status).toUpperCase();
            if (patch.status === 'CLOSED') {
                patch.closedAt = new Date();
                patch.closedBy = req.user._id;
                patch.resolution = req.body.resolution || null;
            }
            if (patch.status === 'OPEN') {
                patch.closedAt = null;
                patch.closedBy = null;
                patch.resolution = null;
            }
        }
        if (req.body.resolution && !patch.status) {
            patch.resolution = req.body.resolution;
        }

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