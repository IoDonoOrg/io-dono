const mongoose = require('mongoose');

const rewardClaimSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    rewardId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Reward',
        required: true,
        index: true
    },
    status: {
        type: String,
        enum: ['ACTIVATED', 'USED', 'EXPIRED'],
        default: 'ACTIVATED'
    },
    activationCode: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    activatedAt: {
        type: Date,
        default: Date.now
    },
    usedAt: {
        type: Date,
        default: null
    }
}, {
    timestamps: true
});

rewardClaimSchema.index({ userId: 1, rewardId: 1 });

const RewardClaim = mongoose.model('RewardClaim', rewardClaimSchema);
module.exports = RewardClaim;
