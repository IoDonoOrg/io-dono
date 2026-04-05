const mongoose = require('mongoose');

const Donation = require('../models/Donazione');
const Report = require('../models/Segnalazione');
const User = require('../models/User');
const { getDateRange, parseQuantityNumber, validateObjectId } = require('../../utils/statistics.utils');

const getDefaultPeriod = () => getDateRange({ defaultDays: 30, allowFutureEnd: true });

const buildDonationsSummary = async (match = {}) => {
    const donations = await Donation.find(match).lean();

    const byCategory = {};
    let totalDonations = 0;

    for (const donation of donations) {
        totalDonations += 1;
        for (const item of donation.items || []) {
            const typeKey = item.type || 'ALTRO';
            byCategory[typeKey] = (byCategory[typeKey] || 0) + parseQuantityNumber(item.quantity);
        }
    }

    return { totalDonations, byCategory };
};

// Crea un account associazione dal pannello admin.
exports.createAssociationUser = async (req, res) => {
    try {
        const { email, password, name, phoneNumber, address, profile } = req.body;
        if (!email || !password || !name || !phoneNumber || !address) {
            return res.status(400).json({ message: 'Dati incompleti per la creazione associazione.' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email già in uso.' });
        }

        const associationUser = new User({
            email,
            password,
            name,
            phoneNumber,
            address,
            profile,
            role: 'ASSOCIATION'
        });

        await associationUser.save();
        associationUser.password = undefined;

        return res.status(201).json({ user: associationUser });
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        return res.status(500).json({ message: 'Errore creazione account associazione.', error: error.message });
    }
};

// Aggiorna stato amministrativo utente (es. ban/unban).
exports.patchUserAdminState = async (req, res) => {
    try {
        const { id } = req.params;
        if (!validateObjectId(id)) {
            return res.status(400).json({ message: 'ID utente non valido.' });
        }

        if (req.user._id.toString() === id) {
            return res.status(409).json({ message: 'Non puoi modificare lo stato del tuo account admin.' });
        }

        const patch = {};
        if (typeof req.body.isBanned !== 'undefined') {
            patch.isBanned = Boolean(req.body.isBanned);
            patch.bannedAt = patch.isBanned ? new Date() : null;
            patch.bannedBy = patch.isBanned ? req.user._id : null;
            patch.bannedReason = patch.isBanned ? (req.body.bannedReason || 'Non specificata') : null;
        }

        if (Object.keys(patch).length === 0) {
            return res.status(400).json({ message: 'Nessun campo valido da aggiornare.' });
        }

        const updatedUser = await User.findByIdAndUpdate(id, { $set: patch }, { new: true }).select('-password');
        if (!updatedUser) {
            return res.status(404).json({ message: 'Utente non trovato.' });
        }

        return res.status(200).json({ user: updatedUser });
    } catch (error) {
        return res.status(500).json({ message: 'Errore aggiornamento utente.', error: error.message });
    }
};

// KPI principali per dashboard admin.
exports.getStatisticsOverview = async (req, res) => {
    try {
        const period = getDefaultPeriod();
        const donationMatch = { createdAt: { $gte: period.start, $lte: period.end } };

        const [{ totalDonations, byCategory }, totalReports, reportByStatus] = await Promise.all([
            buildDonationsSummary(donationMatch),
            Report.countDocuments({ createdAt: { $gte: period.start, $lte: period.end } }),
            Report.aggregate([
                { $match: { createdAt: { $gte: period.start, $lte: period.end } } },
                { $group: { _id: '$status', count: { $sum: 1 } } }
            ])
        ]);

        const usersByRole = await User.aggregate([
            { $group: { _id: '$role', count: { $sum: 1 } } }
        ]);

        return res.status(200).json({
            period,
            donations: {
                total: totalDonations,
                byCategory
            },
            reports: {
                total: totalReports,
                byStatus: reportByStatus
            },
            usersByRole
        });
    } catch (error) {
        return res.status(500).json({ message: 'Errore statistiche overview.', error: error.message });
    }
};

// Trend donazioni nel tempo.
exports.getStatisticsTrend = async (req, res) => {
    try {
        const { fromDate, toDate } = req.query;
        const range = getDateRange({ fromDate, toDate, defaultDays: 30, allowFutureEnd: true });

        if (range.error) {
            return res.status(400).json({ message: range.error });
        }

        const trend = await Donation.aggregate([
            { $match: { createdAt: { $gte: range.start, $lte: range.end } } },
            {
                $group: {
                    _id: {
                        year: { $year: '$createdAt' },
                        month: { $month: '$createdAt' },
                        day: { $dayOfMonth: '$createdAt' }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
        ]);

        return res.status(200).json({ period: { from: range.start, to: range.end }, trend });
    } catch (error) {
        return res.status(500).json({ message: 'Errore statistiche trend.', error: error.message });
    }
};

// Statistiche filtrate con default richiesti.
exports.getStatisticsFilter = async (req, res) => {
    try {
        const { area, itemType, fromDate, toDate, associationId } = req.query;
        const range = getDateRange({ fromDate, toDate, defaultDays: 30, allowFutureEnd: true });

        if (range.error) {
            return res.status(400).json({ message: range.error });
        }

        const match = {
            createdAt: { $gte: range.start, $lte: range.end }
        };

        if (associationId) {
            if (!mongoose.Types.ObjectId.isValid(associationId)) {
                return res.status(400).json({ message: 'associationId non valido.' });
            }
            match.associationId = new mongoose.Types.ObjectId(associationId);
        }

        if (area) {
            match['pickupLocation.address'] = { $regex: area, $options: 'i' };
        }

        const donations = await Donation.find(match).lean();

        const byAssociation = {};
        const byCategory = {};

        for (const donation of donations) {
            const associationKey = donation.associationId ? donation.associationId.toString() : 'UNASSIGNED';
            byAssociation[associationKey] = (byAssociation[associationKey] || 0) + 1;

            for (const item of donation.items || []) {
                const typeKey = item.type || 'ALTRO';
                if (itemType && typeKey !== itemType) continue;
                byCategory[typeKey] = (byCategory[typeKey] || 0) + parseQuantityNumber(item.quantity);
            }
        }

        let associationWeeklyReport = null;
        if (associationId && !area && !itemType && !fromDate && !toDate) {
            const weekStart = new Date();
            weekStart.setDate(weekStart.getDate() - 7);
            const weeklyCount = await Donation.countDocuments({
                associationId,
                status: 'COMPLETED',
                updatedAt: { $gte: weekStart, $lte: new Date() }
            });
            associationWeeklyReport = {
                associationId,
                completedDonationsLast7Days: weeklyCount
            };
        }

        return res.status(200).json({
            period: { from: range.start, to: range.end },
            filtersApplied: {
                area: area || null,
                itemType: itemType || null,
                associationId: associationId || null
            },
            totals: {
                donations: donations.length,
                byAssociation,
                byCategory
            },
            associationWeeklyReport
        });
    } catch (error) {
        return res.status(500).json({ message: 'Errore statistiche filtrate.', error: error.message });
    }
};
