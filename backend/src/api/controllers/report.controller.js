const Report = require('../models/Segnalazione');

// POST /api/reports 
// Crea una nuova segnalazione
exports.createReport = async (req, res) => {
    try {
        // Estrai i dati dal body.
        // type deve essere 'MALFUNCTION' o 'USER_BEHAVIOR'
        const { reportedUserId, donationId, type, description } = req.body;

        // Validazione: Deve esserci o un utente o una donazione, non entrambi vuoti
        if (!reportedUserId && !donationId) {
            return res.status(400).json({ 
                message: 'Devi specificare un reportedUserId oppure un donationId.' 
            });
        }

        // Creazione oggetto
        const newReport = await Report.create({
            reporterId: req.user._id, 
            reportedUserId: reportedUserId || null,
            donationId: donationId || null,
            type,
            description,
            status: 'OPEN'
        });

        res.status(201).json({
            status: 'success',
            data: { report: newReport }
        });

    } catch (error) {
        res.status(500).json({ message: 'Errore nella creazione della segnalazione', error: error.message });
    }
};

// GET /api/reports
// Ottieni tutte le segnalazioni (ADMIN)
exports.getAllReports = async (req, res) => {
    try {
        // Filtri opzionali 
        const filter = {};
        if (req.query.status) filter.status = req.query.status;
        if (req.query.type) filter.type = req.query.type;

        const reports = await Report.find(filter)
            .populate('reporterId', 'name email')      
            .populate('reportedUserId', 'name email')   
            .populate('donationId', 'title')           
            .sort({ createdAt: -1 });

        res.status(200).json({
            status: 'success',
            results: reports.length,
            data: { reports }
        });

    } catch (error) {
        res.status(500).json({ message: 'Errore nel recupero delle segnalazioni', error: error.message });
    }
};

// GET /api/reports/me 
// Le mie segnalazioni (USER)
exports.getMyReports = async (req, res) => {
    try {
        const reports = await Report.find({ reporterId: req.user._id })
            .populate('reportedUserId', 'name')
            .populate('donationId', 'title')
            .sort({ createdAt: -1 });

        res.status(200).json({
            status: 'success',
            data: { reports }
        });
    } catch (error) {
        res.status(500).json({ message: 'Errore nel recupero delle tue segnalazioni', error: error.message });
    }
};


// PATCH /api/reports/:id/status
// Aggiorna stato (ADMIN)
exports.updateReportStatus = async (req, res) => {
    try {
        const { status } = req.body; 

        const report = await Report.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true, runValidators: true }
        );

        if (!report) {
            return res.status(404).json({ message: 'Segnalazione non trovata' });
        }

        res.status(200).json({
            status: 'success',
            data: { report }
        });

    } catch (error) {
        res.status(500).json({ message: 'Errore aggiornamento stato', error: error.message });
    }
};