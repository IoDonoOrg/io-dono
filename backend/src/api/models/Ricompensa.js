const mongoose = require('mongoose');

const rewardSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    pointsCost: {
        type: Number,
        required: true,
        min: 0
    },
    isActive: {
        type: Boolean,
        default: true,
        index: true
    },
    expiresAt: {
        type: Date,
        default: null
    },
    maxRedemptions: {
        type: Number,
        default: null,
        min: 1
    },
    currentRedemptions: {
        type: Number,
        default: 0,
        min: 0
    }
}, {
    timestamps: true
});

const Reward = mongoose.model('Reward', rewardSchema);
module.exports = Reward;
