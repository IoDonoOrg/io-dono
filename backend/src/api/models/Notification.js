const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    recipientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    type: {
        type: String,
        enum: ['DONATION_ACCEPTED', 'DONATION_COMPLETED', 'REWARD_ACTIVATED', 'SYSTEM'],
        required: true
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    isRead: {
        type: Boolean,
        default: false,
        index: true
    },
    metadata: {
        donationId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Donation'
        },
        rewardId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Reward'
        }
    }
}, {
    timestamps: true
});

notificationSchema.index({ recipientId: 1, createdAt: -1 });

const Notification = mongoose.model('Notification', notificationSchema);
module.exports = Notification;
