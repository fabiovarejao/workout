const mongoose = require('../../database');

const bcrypt = require('bcryptjs');

const TrainerSchema = new mongoose.Schema({
    certificationNumber: {
        type: String,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

const Trainer = mongoose.model('Trainer', TrainerSchema);

module.exports = Trainer;