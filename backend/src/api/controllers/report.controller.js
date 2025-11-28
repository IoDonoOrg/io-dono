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

// PROSSIME 4 FUNZIONI DA MODIFICARE 

// GET /api/reports/me/open
// Le mie segnalazioni (USER)
exports.getMyOpenReports = async (req, res) => {
    try {
        const reports = await Report.find({ reporterId: req.user._id, status: 'OPEN' })
            .populate('reportedUserId', 'name') // dei join per evitare di avere id
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

// GET /api/reports/me/closed
// Le mie segnalazioni (USER)
exports.getMyClosedReports = async (req, res) => {
    try {
        const reports = await Report.find({ reporterId: req.user._id, status: 'CLOSED' })
            .populate('reportedUserId', 'name') // dei join per evitare di avere id
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

// GET /api/reports/admin/open
// Ottieni tutte le segnalazioni (ADMIN)
exports.getAllOpenReports = async (req, res) => {
    try {

        const filter = {};
        filter.status = 'OPEN';
        // da capire se separare la logica o tenerla tramite l'utilizzo di un parametro 
        if (req.query.type) filter.type = req.query.type;

        const reports = await Report.find(filter)
            .populate('reporterId', 'name email')      
            .populate('reportedUserId', 'name email')   // dei join per evitare di avere id 
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

// GET /api/reports/admin/closed
// Ottieni tutte le segnalazioni (ADMIN)
exports.getAllClosedReports = async (req, res) => {
    try {

        const filter = {};
        filter.status = 'CLOSED';
        if (req.query.type) filter.type = req.query.type;

        const reports = await Report.find(filter)
            .populate('reporterId', 'name email')      
            .populate('reportedUserId', 'name email')   // dei join per evitare di avere id 
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

// DA QUI APPOSTO

// PATCH /api/reports/:id/status
// Aggiorna stato (ADMIN)
exports.updateReportStatus = async (req, res) => {
    try {
        const { status } = req.body; 

        const report = await Report.findByIdAndUpdate(
            req.params.id,
            { status }, // da capire se tenere IN_PROGRESS in caso basta mettere RESOLVED visto che da resolved non può passare a open 
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