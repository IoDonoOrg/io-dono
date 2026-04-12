const mongoose = require('mongoose');
const crypto = require('crypto');

const Reward = require('../models/Ricompensa');
const RewardClaim = require('../models/RewardClaim');
const User = require('../models/User');
const Notification = require('../models/Notification');

const DEFAULT_REWARD_COST = 50;

const generateActivationCode = () => `RW-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;

// Elenca le reward attive disponibili per l'utente autenticato.
exports.listRewards = async (req, res) => {
    try {
        const now = new Date();
        const rewards = await Reward.find({
            isActive: true,
            $or: [{ expiresAt: null }, { expiresAt: { $gt: now } }]
        }).sort({ createdAt: -1 });

        const claimedRewardIds = await RewardClaim.distinct('rewardId', {
            userId: req.user._id,
            status: { $in: ['ACTIVATED', 'USED'] }
        });

        const claimedSet = new Set(claimedRewardIds.map((id) => id.toString()));
        const items = rewards
            .filter((reward) => !claimedSet.has(reward._id.toString()))
            .map((reward) => {
                const pointsRequired = reward.pointsCost || DEFAULT_REWARD_COST;
                return {
                    ...reward.toObject(),
                    pointsRequired,
                    canRedeem: req.user.solidarityPoints >= pointsRequired
                };
            });

        return res.status(200).json({
            items,
            solidarityPoints: req.user.solidarityPoints,
            defaultPointsThreshold: DEFAULT_REWARD_COST
        });
    } catch (error) {
        return res.status(500).json({ message: 'Errore nel recupero delle ricompense.', error: error.message });
    }
};

// Elenca i claim reward dell'utente autenticato.
exports.listMyRewardClaims = async (req, res) => {
    try {
        const { status, page = 1, limit = 20 } = req.query;
        const filter = { userId: req.user._id };
        if (status) {
            filter.status = status;
        }

        const safePage = Math.max(1, parseInt(page, 10) || 1);
        const safeLimit = Math.max(1, parseInt(limit, 10) || 20);
        const skip = (safePage - 1) * safeLimit;

        const [items, total] = await Promise.all([
            RewardClaim.find(filter)
                .populate('rewardId')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(safeLimit),
            RewardClaim.countDocuments(filter)
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
        return res.status(500).json({ message: 'Errore nel recupero delle attivazioni.', error: error.message });
    }
};

// Attiva una reward e genera codice.
exports.createRewardClaim = async (req, res) => {
    let session;
    try {
        const { rewardId } = req.body;
        if (!rewardId || !mongoose.Types.ObjectId.isValid(rewardId)) {
            return res.status(400).json({ message: 'rewardId non valido.' });
        }

        session = await mongoose.startSession();
        session.startTransaction();

        const reward = await Reward.findById(rewardId).session(session);
        if (!reward) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ message: 'Ricompensa non trovata.' });
        }

        if (!reward.isActive) {
            await session.abortTransaction();
            session.endSession();
            return res.status(409).json({ message: 'Ricompensa non attiva.' });
        }

        if (reward.expiresAt && reward.expiresAt <= new Date()) {
            await session.abortTransaction();
            session.endSession();
            return res.status(409).json({ message: 'Ricompensa scaduta.' });
        }

        if (reward.maxRedemptions && reward.currentRedemptions >= reward.maxRedemptions) {
            await session.abortTransaction();
            session.endSession();
            return res.status(409).json({ message: 'Ricompensa non più disponibile.' });
        }

        const existingClaim = await RewardClaim.findOne({
            userId: req.user._id,
            rewardId,
            status: { $in: ['ACTIVATED', 'USED'] }
        }).session(session);

        if (existingClaim) {
            await session.abortTransaction();
            session.endSession();
            return res.status(409).json({ message: 'Ricompensa già attivata da questo utente.' });
        }

        const pointsRequired = reward.pointsCost || DEFAULT_REWARD_COST;
        const user = await User.findById(req.user._id).session(session);

        if (!user) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ message: 'Utente non trovato.' });
        }

        if (user.solidarityPoints < pointsRequired) {
            await session.abortTransaction();
            session.endSession();
            return res.status(409).json({ message: 'Punti solidali insufficienti.' });
        }

        const activationCode = generateActivationCode();
        const claim = await RewardClaim.create([{
            userId: user._id,
            rewardId: reward._id,
            status: 'ACTIVATED',
            activationCode,
            activatedAt: new Date()
        }], { session });

        user.solidarityPoints -= pointsRequired;
        user.redeemedRewards.push(reward._id);
        await user.save({ session });

        reward.currentRedemptions += 1;
        await reward.save({ session });

        await Notification.create([{
            recipientId: user._id,
            type: 'REWARD_ACTIVATED',
            title: 'Ricompensa attivata',
            message: `Hai attivato la ricompensa: ${reward.title}. Codice: ${activationCode}`,
            metadata: { rewardId: reward._id }
        }], { session });

        await session.commitTransaction();
        session.endSession();

        return res.status(201).json({
            claim: claim[0],
            pointsSpent: pointsRequired,
            remainingPoints: user.solidarityPoints
        });
    } catch (error) {
        if (session) {
            try { await session.abortTransaction(); } catch (e) { }
            session.endSession();
        }
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        return res.status(500).json({ message: 'Errore durante l\'attivazione della ricompensa.', error: error.message });
    }
};

// Aggiorna lo stato di una reward attivata (es. USED).
exports.patchRewardClaim = async (req, res) => {
    try {
        const { claimId } = req.params;
        if (!mongoose.Types.ObjectId.isValid(claimId)) {
            return res.status(400).json({ message: 'ID attivazione non valido.' });
        }

        const { status } = req.body;
        if (!status || !['USED', 'EXPIRED'].includes(status)) {
            return res.status(400).json({ message: 'Stato non valido. Usa USED o EXPIRED.' });
        }

        const claim = await RewardClaim.findOne({ _id: claimId, userId: req.user._id });
        if (!claim) {
            return res.status(404).json({ message: 'Attivazione non trovata.' });
        }

        if (claim.status !== 'ACTIVATED') {
            return res.status(409).json({ message: 'Attivazione già chiusa.' });
        }

        claim.status = status;
        if (status === 'USED') {
            claim.usedAt = new Date();
        }

        await claim.save();
        return res.status(200).json(claim);
    } catch (error) {
        return res.status(500).json({ message: 'Errore aggiornamento attivazione.', error: error.message });
    }
};
