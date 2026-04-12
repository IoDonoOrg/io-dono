const Donation = require('../models/Donazione');
const User = require('../models/User');
const { getDateRange, parseQuantityNumber } = require('../../utils/statistics.utils');

const toDateKey = (date) => date.toISOString().slice(0, 10);

// Restituisce il report settimanale per l'associazione autenticata.
exports.getWeeklyReport = async (req, res) => {
    try {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 7);

        const donations = await Donation.find({
            associationId: req.user._id,
            status: 'COMPLETED',
            updatedAt: { $gte: startDate, $lte: endDate }
        }).lean();

        const donationsReceived = donations.length;
        const donorsCount = new Map();
        let estimatedWasteReduced = 0;

        for (const donation of donations) {
            const donorKey = donation.donorId ? donation.donorId.toString() : null;
            if (donorKey) {
                donorsCount.set(donorKey, (donorsCount.get(donorKey) || 0) + 1);
            }
            for (const item of donation.items || []) {
                estimatedWasteReduced += parseQuantityNumber(item.quantity);
            }
        }

        const topDonorsEntries = Array.from(donorsCount.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);

        const donorIds = topDonorsEntries.map(([id]) => id);
        const donorDocs = donorIds.length > 0
            ? await User.find({ _id: { $in: donorIds } }).select('name email')
            : [];

        const donorMap = new Map(donorDocs.map((donor) => [donor._id.toString(), donor]));
        const topDonors = topDonorsEntries.map(([id, count]) => ({
            donorId: id,
            name: donorMap.get(id) ? donorMap.get(id).name : null,
            email: donorMap.get(id) ? donorMap.get(id).email : null,
            donationsCount: count
        }));

        return res.status(200).json({
            period: {
                from: startDate,
                to: endDate
            },
            donationsReceived,
            topDonors,
            estimatedWasteReduced
        });
    } catch (error) {
        return res.status(500).json({ message: 'Errore generazione report settimanale.', error: error.message });
    }
};

// Restituisce tabella beni raccolti per tipologia e giorno nel range selezionato.
exports.getItemsReport = async (req, res) => {
    try {
        const { fromDate, toDate } = req.query;
        const range = getDateRange({ fromDate, toDate, defaultDays: 7, allowFutureEnd: false });

        if (range.error) {
            return res.status(400).json({ message: range.error });
        }

        const donations = await Donation.find({
            associationId: req.user._id,
            status: 'COMPLETED',
            pickupTime: { $gte: range.start, $lte: range.end }
        }).lean();

        const dailyByType = {};
        const totalsByType = {};

        for (const donation of donations) {
            const dayKey = toDateKey(new Date(donation.pickupTime));
            if (!dailyByType[dayKey]) {
                dailyByType[dayKey] = {};
            }

            for (const item of donation.items || []) {
                const typeKey = item.type || 'ALTRO';
                const quantityValue = parseQuantityNumber(item.quantity);

                dailyByType[dayKey][typeKey] = (dailyByType[dayKey][typeKey] || 0) + quantityValue;
                totalsByType[typeKey] = (totalsByType[typeKey] || 0) + quantityValue;
            }
        }

        return res.status(200).json({
            period: {
                from: range.start,
                to: range.end
            },
            rows: dailyByType,
            totals: totalsByType
        });
    } catch (error) {
        return res.status(500).json({ message: 'Errore generazione statistiche beni.', error: error.message });
    }
};
