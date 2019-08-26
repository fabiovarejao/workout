const mongoose = require('../../database');

const bcrypt = require('bcryptjs');

const MuscleGroupSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

const MuscleGroup = mongoose.model('MuscleGroup', MuscleGroupSchema);

module.exports = MuscleGroup;