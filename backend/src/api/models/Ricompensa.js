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
    }
}, {
    timestamps: true
});

const Reward = mongoose.model('Reward', rewardSchema);
module.exports = Reward;
